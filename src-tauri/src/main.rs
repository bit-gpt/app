// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::blocking::get;
use serde::Deserialize;
use std::{env, thread};
use tauri::{
    AboutMetadata, api::process::Command, CustomMenuItem, Manager, Menu, MenuItem, RunEvent,
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

fn is_python_installed() -> bool {
    let output = Command::new("/usr/bin/python3")
        .args(["--version"])
        .output()
        .map_err(|e| {
            println!("Failed to execute docker info: {}", e);
            e
        });

    println!("output: {:?}", output);

    if !output.unwrap().stdout.is_empty() {
        return true;
    }
    return false;
}

#[tauri::command]
fn is_swarm_mode_running() -> bool {
    return false;
}

#[tauri::command]
fn run_swarm_mode() -> Result<bool, String> {
    if is_python_installed() {
        println!("Python is installed");

        thread::spawn(|| {
            println!("Hello from a thread!");

            let output = Command::new("/usr/bin/python3")
                .args(&["-m", "pip", "install", "git+https://github.com/bigscience-workshop/petals",])
                .output()
                .expect("Failed to execute command");
    
            println!("stdout: {}", output.stdout);
            println!("stderr: {}", output.stderr);

            let output = Command::new("/usr/bin/python3")
                .args(&["-m", "petals.cli.run_server", "--public_name", "https://premai.io", "petals-team/StableBeluga2"])
                .output()
                .expect("Failed to execute command");
            
            println!("stdout: {}", output.stdout);
            println!("stderr: {}", output.stderr);
        });
        
    } else {
        println!("Python is not installed, skipping...");
    }
    Ok(true)
}

#[tauri::command]
fn stop_swarm_mode() {
    println!("Killing background job");
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
                .add_item(CustomMenuItem::new(
                    "quit",
                    "Quit Prem App",
                ).accelerator("CommandOrControl+Q")),
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
