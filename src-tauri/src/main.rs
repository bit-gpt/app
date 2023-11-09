// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controller_binaries;
mod download;
mod errors;
mod swarm;
mod utils;

use crate::controller_binaries::stop_all_services;

use std::{collections::HashMap, env, ops::Deref, str, sync::Arc};

use sentry_tauri::sentry;
use serde::{Deserialize, Serialize};
use tauri::{
    AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, RunEvent, Submenu, SystemTray,
    SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};
use tauri_plugin_store::StoreBuilder;
use tokio::process::Child;
use tokio::sync::Mutex;

#[derive(Debug, Default)]
pub struct SharedState {
    downloading_files: Mutex<Vec<String>>,
    running_services: Mutex<HashMap<String, Child>>,
    // Properties from public service registry and additional service state
    services: Mutex<HashMap<String, Service>>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Registry {
    url: String,
}

impl Default for Registry {
    fn default() -> Self {
        // Determine the URL based on whether the app is in debug or release mode
        let url = if cfg!(debug_assertions) {
            // Debug mode URL
            "https://raw.githubusercontent.com/premAI-io/prem-registry/dev/manifests.json"
        } else {
            // Release mode URL
            "https://raw.githubusercontent.com/premAI-io/prem-registry/v1/manifests.json"
        };
        Registry {
            url: url.to_string(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Store {
    registries: Vec<Registry>,
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
    petals: Option<bool>,
    #[serde(rename = "skipHealthCheck")]
    skip_health_check: Option<bool>,
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

impl Service {
    fn get_id(&self) -> errors::Result<String> {
        use errors::Context;
        self.id
            .clone()
            .with_context(|| format!("Service doesn't contain a valid id\n{:#?}", self))
    }
    // ref to String is used as it's more generally coerce-able
    fn get_id_ref(&self) -> errors::Result<&String> {
        use errors::Context;
        self.id
            .as_ref()
            .with_context(|| format!("Service doesn't contain a valid id\n{:#?}", self))
    }
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

fn main() {
    let client = sentry::init((
        "https://b98405fd0e4cc275b505645d293d23a5@o4506111848808448.ingest.sentry.io/4506111925223424",
        sentry::ClientOptions {
            release: sentry::release_name!(),
            debug: false, // this outputs dsn to stdout on sentry init
            ..Default::default()
        },
    ));

    // Everything before here runs in both app and crash reporter processes
    let _guard = sentry_tauri::minidump::init(&client);
    // Everything after here runs in only the app process

    // TODO: consider directly pushing logs to sentry (sentry-sdk provides
    // log integration) for release builds

    // initialize logger
    pretty_env_logger::formatted_builder()
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

    let state = std::sync::Arc::new(SharedState::default());

    let app = tauri::Builder::default()
        .plugin(sentry_tauri::plugin())
        .plugin(tauri_plugin_store::Builder::default().build())
        .manage(state.clone())
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
            controller_binaries::add_registry,
            controller_binaries::delete_registry,
            controller_binaries::fetch_registries,
            controller_binaries::reset_default_registry,
            swarm::is_swarm_supported,
            swarm::get_username,
            swarm::get_petals_models,
            swarm::create_environment,
            swarm::delete_environment,
            swarm::run_swarm,
            swarm::stop_swarm_mode,
            swarm::is_swarm_mode_running
        ])
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                controller_binaries::stop_all_services(
                    event.window().state::<Arc<SharedState>>().deref().clone(),
                );
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
                    let Some(window) = app.get_window("main") else {
                        log::error!("Couldn't get window from for label 'main'");
                        return;
                    };
                    logerr!(window.hide());
                }
                "quit" => {
                    controller_binaries::stop_all_services(
                        app.state::<Arc<SharedState>>().deref().clone(),
                    );
                    app.exit(0);
                }
                "show" => {
                    let Some(window) = app.get_window("main") else {
                        log::error!("Couldn't get window from for label 'main'");
                        return;
                    };
                    logerr!(window.set_focus());
                    logerr!(window.show());
                }
                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                //Create a store with default registry if doesn't exist
                let store_path = app
                    .path_resolver()
                    .app_data_dir()
                    .expect("failed to resolve app data dir")
                    .join("store.json");
                if !store_path.exists() {
                    let mut registries: Vec<Registry> = Vec::new();
                    registries.push(Registry::default());
                    let mut default_store = HashMap::new();
                    default_store.insert(
                        "registries".to_string(),
                        serde_json::to_value(registries).unwrap(),
                    );
                    let store = StoreBuilder::new(app.handle(), store_path.clone())
                        .defaults(default_store)
                        .build();
                    store.save().expect("failed to save store");
                    log::info!("Store created");
                }
                // Fetch all registries
                let mut store = StoreBuilder::new(app.handle(), store_path.clone()).build();
                store.load().expect("Failed to load store");
                if let Some(registries) = store.get("registries").cloned() {
                    match serde_json::from_value::<Vec<Registry>>(registries) {
                        Ok(registries) => utils::fetch_all_services_manifests(
                            &registries,
                            &app.state::<Arc<SharedState>>().clone(),
                        )
                        .await
                        .expect("failed to fetch services"),
                        Err(e) => println!("Error unwrapping registries: {:?}", e),
                    }
                }
            });
            Ok(())
        })
        .on_window_event(|ev| {
            if matches!(ev.event(), WindowEvent::Destroyed) {
                stop_all_services(ev.window().state::<Arc<SharedState>>().deref().clone());
            }
        })
        .build(tauri::generate_context!())
        .expect("Error while building tauri application");

    {
        let app_handle = app.handle();
        let s = state.clone();
        std::panic::set_hook(Box::new(move |_| {
            stop_all_services(s.clone());
            app_handle.exit(-1);
        }));

        let app_handle = app.handle();
        let s = state.clone();
        ctrlc::set_handler(move || {
            stop_all_services(s.clone());
            app_handle.exit(-1);
        })
        .expect("Error setting Ctrl-C handler");
    }

    app.run(|app_handle, e| match e {
        // Triggered when a window is trying to close
        RunEvent::WindowEvent { label, event, .. } => {
            match event {
                WindowEvent::CloseRequested { api, .. } => {
                    logsome!(
                        app_handle.get_window(&label).map(|e| logerr!(
                            e.hide(),
                            "Failed to hide window with label({label:?})"
                        )),
                        "Failed to get app window with label({label:?})"
                    );
                    // use the exposed close api, and prevent the event loop to close
                    api.prevent_close();
                }
                _ => {}
            }
        }
        _ => {}
    });
}
