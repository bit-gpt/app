// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod controller_binaries;
mod download;
mod errors;
mod utils;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::{
    AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, RunEvent, Submenu, SystemTray,
    SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};
use tokio::{process::Child, sync::Mutex};

#[derive(Debug, Default)]
pub struct SharedState {
    downloading_services: Mutex<Vec<String>>,
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
    downloaded: Option<bool>,
    downloading: Option<bool>,
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

fn main() {
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
        ])
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                let _ = controller_binaries::stop_all_services(event.window().state());
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
                    let _ = controller_binaries::stop_all_services(app.state());
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
