// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs, net::TcpStream, thread, time::Duration};
use tauri::api::{path, process::Command};
use serde::Deserialize;
use reqwest::blocking::get;

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
    let container_check = is_container_running();
    if container_check {
        println!("Container is already running");
        return;
    }

    //pull versions.json from GitHub repository prem-box
    let url = "https://raw.githubusercontent.com/premAI-io/prem-box/main/versions.json";
    let response = get(url).expect("Request failed");
    let config: Config = response.json().expect("Failed to parse JSON");

    let image = format!("{}:{}@{}",
        config.prem.daemon.image,
        config.prem.daemon.version,
        config.prem.daemon.digest
    );

    
    let cmd = Command::new("docker")
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
            "PREM_REGISTRY_URL=https://raw.githubusercontent.com/premAI-io/prem-daemon/main/resources/mocks/manifests.json",
            "--rm",
            image.as_str(),
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
        match TcpStream::connect(("127.0.0.1", 8000)) {
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
        .args(["ps", "-q", "-f", "name=premd"])
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