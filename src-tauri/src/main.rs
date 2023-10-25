// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::blocking::get;
use reqwest::get as reqwest_get;
use serde::Deserialize;
use std::{env, thread, str, collections::HashMap};
use tauri::{
    api::process::Command as Command, AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, RunEvent,
    Submenu, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};

#[derive(Deserialize, Debug)]
struct App {
    version: String, 
    image: String,
    digest: String,
}

#[derive(Deserialize, Debug)]
struct Prem {
    daemon: App,
}

#[derive(Deserialize, Debug)]
struct Config {
    prem: Prem,
}

#[derive(Deserialize)]
struct ModelInfo {
    name: String,
    state: String,
}

#[tauri::command]
fn run_container() {
    // check if docker is running
    let docker_check = is_docker_running();
    if !docker_check {
        println!("Docker is not running");
        return;
    }

    //pull versions.json from GitHub repository prem-box
    let url = "https://raw.githubusercontent.com/premAI-io/prem-box/main/versions.json";
    let response = get(url).expect("Request failed");
    let config: Config = response.json().expect("Failed to parse JSON");

    let image = format!(
        "{}:{}@{}",
        config.prem.daemon.image, config.prem.daemon.version, config.prem.daemon.digest
    );

    println!("Prem Daemon {}", image);

    // run in a separate thread the docker pull
    let _child = thread::spawn(move || {
        let status = Command::new("/usr/local/bin/docker")
            .args(&[
                "run",
                "-d",
                "-v",
                "/var/run/docker.sock:/var/run/docker.sock",
                "-p",
                "54321:8000",
                "--name",
                "premd",
                "-e",
                "PREM_REGISTRY_URL=https://raw.githubusercontent.com/premAI-io/prem-registry/main/manifests.json",
                "--rm",
                image.as_str(),
            ])
            .status();

        match status {
            Ok(exit_status) => {
                if exit_status.success() {
                    println!("Docker container started successfully!");
                } else {
                    println!("Docker command failed with exit status: {:?}", exit_status);
                }
            }
            Err(error) => {
                println!("Failed to execute docker command: {:?}", error);
            }
        }
    });

    _child.join().expect("Thread panicked");
}

#[tauri::command]
fn is_docker_running() -> bool {
    let output = Command::new("/usr/bin/pgrep")
        .args(["Docker"])
        .output()
        .map_err(|e| {
            println!("Failed to execute docker info: {}", e);
            e
        });

    if !output.unwrap().stdout.is_empty() {
        return true;
    }
    return false;
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
    let response = reqwest_get(url).await.map_err(|err| err.to_string())?;

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
    let _ = Command::new("sh")
        .args([format!("{petals_path}/create_env.sh")])
        .envs(env)
        .output()
        .expect("🙈 Failed to create env");
    format!("{app_data_dir}/envs/prem-env/bin/python3").to_string()
}


#[tauri::command(async)]
fn run_swarm_mode(handle: tauri::AppHandle, num_blocks: i32, model: String, public_name: String){
    let python: String = create_environment(handle);
    println!("🚀 Starting the Swarm...");

    let _ = Command::new(&python)
        .args(&[
            "-m",
            "petals.cli.run_server",
            "--num_blocks",
            &num_blocks.to_string(),
            "--public_name",
            &public_name,
            &model,
        ])
        .spawn()
        .expect("🙈 Failed to run swarm");
}


fn get_swarm_processes() -> String {
    // Check if create_env.sh is running
    let output = Command::new("/usr/bin/pgrep")
        .args(&["-f", "create_env.sh|conda.exe"])
        .output()
        .map_err(|e| {
            println!("🙈 Failed to execute command: {}", e);
            e
        });

    let output_value = output.unwrap().stdout;

    // If create_env.sh is running, return an empty string
    if !output_value.is_empty() {
        return "".to_string();
    }

    // If create_env.sh is not running, get the processes from petals
    let output = Command::new("/usr/bin/pgrep")
        .args(&["-f", "https://github.com/bigscience-workshop/petals|petals.cli.run_server|multiprocessing.resource_tracker|from multiprocessing.spawn"])
        .output()
        .map_err(|e| {
            println!("🙈 Failed to execute command: {}", e);
            e
        });

    let output_value = output.unwrap().stdout;
    output_value
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

#[tauri::command]
fn is_container_running() -> Result<bool, String> {
    let output = Command::new("/usr/local/bin/docker")
        .args(&["ps", "-q", "-f", "name=premd"])
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))?;

    Ok(!output.stdout.is_empty())
}

fn kill_container() {
    // stop services
    let url = "http://localhost:54321/v1/stop-all-services/";
    get(url).expect("Request failed");
    // stop docker
    let _child = Command::new("/usr/local/bin/docker")
        .args(&["kill", "premd"])
        .output()
        .expect("Failed to execute docker stop");
}

fn main() {
    fix_path_env::fix();
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

    #[allow(unused_mut)]
    let mut app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            run_container,
            is_docker_running,
            is_container_running,
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
                kill_container();
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
                    kill_container();
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
