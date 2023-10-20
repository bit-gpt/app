// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controller_binaries;
mod download;
mod errors;
mod utils;

use reqwest::get;
use sentry_tauri::sentry;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, thread, str};
use tauri::{
    AboutMetadata, api::process::Command, CustomMenuItem, Manager, Menu, MenuItem, RunEvent,
    Submenu, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};
use tokio::{process::Child, sync::Mutex};

#[derive(Debug, Default)]
pub struct SharedState {
    downloading_files: Mutex<Vec<String>>,
    running_services: Mutex<HashMap<String, Child>>,
    // Properties from public service registry and additional service state
    services: Mutex<HashMap<String, Service>>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Service {
    // Static state from registry manifest
    beta: Option<bool>,
    #[serde(rename = "comingSoon")]
    coming_soon: Option<bool>,
    #[serde(rename = "defaultExternalPort")]
    default_external_port: Option<u32>,
    #[serde(rename = "defaultPort")]
    default_port: Option<u32>,
    description: Option<String>,
    documentation: Option<String>,
    icon: Option<String>,
    id: Option<String>,
    interfaces: Vec<String>,
    #[serde(rename = "modelInfo")]
    model_info: ModelInfo,
    name: Option<String>,
    #[serde(rename = "needsUpdate")]
    needs_update: Option<bool>,
    #[serde(rename = "promptTemplate")]
    prompt_template: Option<String>,
    #[serde(rename = "runningPort")]
    running_port: Option<u32>,
    #[serde(rename = "serviceType")]
    service_type: Option<String>,
    version: Option<String>,
    #[serde(rename = "weightsDirectoryUrl")]
    weights_directory_url: Option<String>,
    #[serde(rename = "weightsFiles")]
    weights_files: Option<Vec<String>>,
    #[serde(rename = "binariesUrl")]
    binaries_url: Option<HashMap<String, Option<String>>>,
    #[serde(rename = "serveCommand")]
    serve_command: Option<String>,
    // Dynamic state
    #[serde(rename = "baseUrl")]
    base_url: Option<String>,
    downloaded: Option<bool>,
    #[serde(rename = "enoughMemory")]
    enough_memory: Option<bool>,
    #[serde(rename = "enoughSystemMemory")]
    enough_system_memory: Option<bool>,
    #[serde(rename = "enoughStorage")]
    enough_storage: Option<bool>,
    running: Option<bool>,
    supported: Option<bool>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
struct ModelInfo {
    #[serde(rename = "inferenceTime")]
    inference_time: Option<String>,
    #[serde(rename = "maxLength")]
    max_length: Option<u32>,
    #[serde(rename = "memoryRequirements")]
    memory_requirements: Option<u32>,
    #[serde(rename = "tokenLimit")]
    token_limit: Option<u32>,
    #[serde(rename = "weightsName")]
    weights_name: Option<String>,
    #[serde(rename = "weightsSize")]
    weights_size: Option<u32>,
    streaming: Option<bool>,
}

#[derive(Deserialize)]
struct ModelInfo {
    name: String,
    state: String,
}

#[tauri::command]
fn is_swarm_supported() -> bool {
    match env::consts::OS {
        "macos" => true,
        _ => false
    }
}

#[tauri::command]
fn get_username() -> String {
    let output = Command::new("whoami").output();

    match output {
        Ok(output) => {
            output.stdout.trim().to_string()
        },
        Err(_) => "prem-app".to_string(),
    }
}

#[tauri::command]
async fn get_petals_models() -> Result<Vec<String>, String> {
    let url = "https://health.petals.dev/api/v1/state";
    let response = get(url).await.map_err(|err| err.to_string())?;

    if response.status().is_success() {
        let json_data: serde_json::Value = response.json().await.map_err(|err| err.to_string())?;

        let models: Vec<String> = json_data["model_reports"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|model_report| {
                let model_info: Result<ModelInfo, _> =
                    serde_json::from_value(model_report.clone());
                match model_info {
                    Ok(model_info) if model_info.state == "healthy" => Some(model_info.name),
                    _ => None,
                }
            })
            .collect();

        Ok(models)
    } else {
        Err("Request failed".to_string())
    }
}



#[tauri::command]
fn is_swarm_mode_running() -> bool {
    let output_value = get_swarm_processes();

    if !output_value.is_empty() {
        println!(
            "🏃‍♀️ Processeses running: {}",
            output_value.replace("\n", " ")
        );
        return true;
    }
    return false;
}

fn create_environment(handle: tauri::AppHandle) -> String {
    // Get the application data directory
    let app_data_dir = tauri::api::path::home_dir().expect("🙈 Failed to get app data directory");
    let app_data_dir = app_data_dir
        .join(".config/prem");
    let app_data_dir = app_data_dir
        .to_str()
        .expect("🙈 Failed to convert app data dir path to str");

    // Get create env path
    let binding = handle.path_resolver()
        .resolve_resource("petals")
        .expect("🙈 Failed to find `create_env.sh`");
    let petals_path = binding
        .to_str()
        .expect("🙈 Failed to convert petals path to str");

    // Set env variables
    let mut env = HashMap::new();
    env.insert("PREM_APPDIR".to_string(), app_data_dir.to_string());
    env.insert("PREM_PYTHON".to_string(), "prem-env".to_string());
    env.insert("REQUIREMENTS".to_string(), format!("{petals_path}/requirements.txt"));

    // Run the bash script
    let output = Command::new("sh")
        .args([format!("{petals_path}/create_env.sh")])
        .envs(env)
        .output()
        .expect("🙈 Failed to create env");
    format!("{app_data_dir}/envs/prem-env/bin/python3").to_string()
}


#[tauri::command]
fn run_swarm_mode(handle: tauri::AppHandle, num_blocks: i32, model: String, public_name: String){
    let python = create_environment(handle);
    println!("🚀 Starting the Swarm with python={}...", python);
    let cmd = Command::new(python)
        .args(&[
            "-m",
            "petals.cli.run_server",
            "--num_blocks",
            &num_blocks.to_string(),
            "--public_name",
            &public_name,
            "--model",
            &model,
        ]);
    println!("{:?}", cmd);
    let output = cmd 
        .spawn()
        .expect("🙈 Failed to execute command");
    println!("{:?}", output);
}

fn get_swarm_processes() -> String {
    let output = Command::new("/usr/bin/pgrep")
        .args(&["-f", "https://github.com/bigscience-workshop/petals|petals.cli.run_server|multiprocessing.resource_tracker|from multiprocessing.spawn"])
        .output()
        .map_err(|e| {
            println!("🙈 Failed to execute command: {}", e);
            e
        });

    let output_value = output.unwrap().stdout;
    return output_value;
}

#[tauri::command]
fn stop_swarm_mode() {
    println!("🛑 Stopping the Swarm...");
    let processes = get_swarm_processes().replace("\n", " ");
    println!("🛑 Stopping Processes: {}", processes);
    let processes = processes.split(" ").collect::<Vec<&str>>();

    for process in processes {
        println!("🛑 Stopping Process: {}", process);
        let _ = Command::new("kill")
            .args(&[process.to_string()])
            .output()
            .map_err(|e| {
                println!("🙈 Failed to execute command: {}", e);
                e
            });
    }
    println!("🛑 Stopped all the Swarm Processes.");
}

fn main() {
    // Sentry
    let client = sentry::init((
        "https://b98405fd0e4cc275b505645d293d23a5@o4506111848808448.ingest.sentry.io/4506111925223424",
        sentry::ClientOptions {
            release: sentry::release_name!(),
            debug: true,
            ..Default::default()
        },
    ));

    // Everything before here runs in both app and crash reporter processes
    let _guard = sentry_tauri::minidump::init(&client);
    // Everything after here runs in only the app process

    // initialize logger
    pretty_env_logger::formatted_timed_builder()
        .format(|buf, record| {
            use std::io::Write;
            writeln!(
                buf,
                "{}:{} {} [{}] - {}",
                record.file().unwrap_or("unknown"),
                record.line().unwrap_or(0),
                chrono::Local::now().format("%Y-%m-%dT%H:%M:%S"),
                record.level(),
                record.args()
            )
        })
        .filter_level(log::LevelFilter::Info)
        .parse_default_env()
        .init();

    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "Prem App",
            Menu::new()
                .add_native_item(MenuItem::About(
                    "About Prem App".to_string(),
                    AboutMetadata::new(),
                ))
                .add_native_item(MenuItem::Minimize)
                .add_native_item(MenuItem::Hide)
                .add_item(
                    CustomMenuItem::new("quit", "Quit Prem App").accelerator("CommandOrControl+Q"),
                ),
        ))
        .add_submenu(Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(MenuItem::Undo)
                .add_native_item(MenuItem::Redo)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::SelectAll),
        ));

    let running = CustomMenuItem::new("running".to_string(), "Prem is running").disabled();
    let show = CustomMenuItem::new("show".to_string(), "Dashboard");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");

    let tray_menu = SystemTrayMenu::new()
        .add_item(running)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(show)
        .add_item(hide)
        .add_item(quit);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    let state = SharedState::default();
    #[allow(unused_mut)]
    let mut app = tauri::Builder::default()
        .plugin(sentry_tauri::plugin())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            controller_binaries::start_service,
            controller_binaries::stop_service,
            controller_binaries::delete_service,
            controller_binaries::download_service,
            controller_binaries::get_running_services,
            controller_binaries::get_logs_for_service,
            controller_binaries::get_services,
            controller_binaries::get_service_by_id,
            controller_binaries::get_system_stats,
            controller_binaries::get_service_stats,
            controller_binaries::get_gpu_stats,
            controller_binaries::add_service,
            is_swarm_supported,
            get_username,
            get_petals_models,
            run_swarm_mode,
            stop_swarm_mode,
            is_swarm_mode_running
        ])
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                controller_binaries::stop_all_services(event.window().state());
                event.window().close().unwrap();
            }
            "close" => {
                event.window().close().unwrap();
            }
            _ => {}
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "quit" => {
                    controller_binaries::stop_all_services(app.state());
                    app.exit(0);
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.set_focus().unwrap();
                    window.show().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                utils::fetch_services_manifests(
                    "https://raw.githubusercontent.com/premAI-io/prem-registry/dev/manifests.json",
                    &app.state::<SharedState>(),
                )
                .await
                .expect("Failed to fetch and save services manifests");
            });
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application");

    app.run(|app_handle, e| match e {
        // Triggered when a window is trying to close
        RunEvent::WindowEvent { label, event, .. } => {
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    app_handle.get_window(&label).unwrap().hide().unwrap();
                    // use the exposed close api, and prevent the event loop to close
                    api.prevent_close();
                }
                _ => {}
            }
        }
        _ => {}
    })
}
