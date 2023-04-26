// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs, net::TcpStream, thread, time::Duration};
use tauri::api::{path, process::Command};

#[tauri::command]
fn run_container(app_handle: tauri::AppHandle) {
    // check if docker is installed
    let docker_check = Command::new("docker")
        .args(["--version"])
        .output()
        .map_err(|e| {
            println!("Failed to execute docker --version: {}", e);
            e
        }); 
    let docker_check_status = docker_check.is_ok();
    if !docker_check_status {
        println!("Docker not installed");
        return;
    }

    // check if container is already running
    let container_check = Command::new("docker")
        .args(["ps", "-q", "-f", "name=ai-box"])
        .output()
        .map_err(|e| {
            println!("Failed to execute docker ps: {}", e);
            e
        });
    println!("Container check: {:?}", container_check);
    let container_check_status = container_check.is_ok();
    if container_check_status && !container_check.unwrap().stdout.is_empty() {
        println!("Container already running");
        return;
    }

    // Get app_dir
    let app_dir = app_handle.path_resolver().app_data_dir().unwrap();
    let cmd = Command::new("docker")
        .args(&[
            "run",
            "-d",
            "-v",
            &format!("{}/models:/usr/src/app/models", app_dir.to_str().unwrap()),
            "-p",
            "8002:8002",
            "--name",
            "ai-box",
            "--rm",
            "ghcr.io/premai-io/ai-box:latest",
        ])
        .output()
        .expect("Failed to execute docker run");

    let cmd_status = cmd.status.success();
    if !cmd_status {
        println!("Failed to run container");
        return;
    }
    
    // wait for APIs to be ready before running the app
    loop {
        match TcpStream::connect(("127.0.0.1", 8002)) {
            Ok(_) => break,
            Err(_) => {
                println!("API not ready yet. Waiting for 1 second...");
                thread::sleep(Duration::from_secs(1));
            }
        }
    }
}

#[tauri::command]
fn is_docker_running() -> bool {    
    let output = Command::new("pgrep")
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
fn is_container_running() -> bool {
    let container_check = Command::new("docker")
        .args(["ps", "-q", "-f", "name=ai-box"])
        .output()
        .map_err(|e| {
            println!("Failed to execute docker ps: {}", e);
            e
        });
    let container_check_status = container_check.is_ok();
    if container_check_status && !container_check.unwrap().stdout.is_empty() {
        return true;
    }
    return false;
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let config = app.config().clone();
            let app_dir = path::app_data_dir(&config).expect("Failed to get app directory");
            let app_dir_str = app_dir.to_string_lossy().to_string();
            fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
            println!("App directory: {}", app_dir_str);

            let models_dir = app_dir.join("models");
            fs::create_dir_all(&models_dir).expect("Failed to create /models/ directory");
            println!("Models directory: {}", models_dir.to_str().unwrap());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            run_container,
            is_container_running,
            is_docker_running
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}