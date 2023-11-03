use reqwest::get;
use serde::Deserialize;
use std::{
    collections::HashMap,
    env,
    path::PathBuf,
    str,
    thread::{self, JoinHandle},
    time::Duration,
};
use tauri::api::process::Command;

#[derive(Deserialize)]
struct PetalsModelInfo {
    name: String,
    state: String,
}

#[tauri::command]
pub fn is_swarm_supported() -> bool {
    match env::consts::OS {
        "macos" => true,
        "linux" => true,
        _ => false,
    }
}

pub struct Config {
    pub app_data_dir: String,
    pub python: String,
}

impl Config {
    pub fn new() -> Self {
        let mut app_data_dir =
            tauri::api::path::home_dir().expect("🙈 Failed to get app data directory");
        app_data_dir.push(".config/prem");
        let app_data_dir = app_data_dir
            .to_str()
            .expect("🙈 Failed to convert app data dir path to str")
            .to_string();

        let python = PathBuf::from(format!(
            "{}/miniconda/envs/prem_app/bin/python",
            app_data_dir
        ))
        .to_str()
        .unwrap_or("python")
        .to_string();

        Config {
            app_data_dir,
            python,
        }
    }
}

#[tauri::command]
pub fn get_username() -> String {
    let output = Command::new("whoami").output();

    match output {
        Ok(output) => output.stdout.trim().to_string(),
        Err(_) => "prem-app".to_string(),
    }
}

#[tauri::command]
pub async fn get_petals_models() -> Result<Vec<String>, String> {
    let url = "https://health.petals.dev/api/v1/state";
    let response = get(url).await.map_err(|err| err.to_string())?;

    if response.status().is_success() {
        let json_data: serde_json::Value = response.json().await.map_err(|err| err.to_string())?;

        let models: Vec<String> = json_data["model_reports"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|model_report| {
                let model_info: Result<PetalsModelInfo, _> =
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
pub fn is_swarm_mode_running() -> bool {
    let processes = get_swarm_processes();

    if processes.len() > 0 {
        println!("🏃‍♀️ Processeses running: {:?}", processes);
        return true;
    }
    return false;
}

#[tauri::command(async)]
pub fn create_environment(handle: tauri::AppHandle) {
    println!("🐍 Creating the environment...");
    let petals_path = get_petals_path(handle);
    let config = Config::new();

    let mut env = HashMap::new();
    env.insert("PREM_APPDIR".to_string(), config.app_data_dir);
    env.insert("PREM_PYTHON".to_string(), config.python);

    let _ = Command::new("sh")
        .args([format!("{petals_path}/create_env.sh")])
        .envs(env)
        .output()
        .expect("🙈 Failed to create env");
}

#[tauri::command(async)]
pub fn delete_environment(handle: tauri::AppHandle) {
    println!("❌ Deleting the environment...");
    let petals_path = get_petals_path(handle);
    let config = Config::new();

    let mut env = HashMap::new();
    env.insert("PREM_APPDIR".to_string(), config.app_data_dir);

    let _ = Command::new("sh")
        .args([format!("{petals_path}/delete_env.sh")])
        .envs(env.clone())
        .output()
        .expect("🙈 Failed to delete env");
}

#[tauri::command(async)]
pub fn run_swarm(handle: tauri::AppHandle, num_blocks: i32, model: String, public_name: String) {
    let petals_path = get_petals_path(handle.clone());
    let config = Config::new();

    let mut env = HashMap::new();
    env.insert("PREM_PYTHON".to_string(), config.python);

    println!("🚀 Starting the Swarm...");
    let _ = Command::new("sh")
        .args([
            format!("{petals_path}/run_swarm.sh").as_str(),
            &num_blocks.to_string(),
            &public_name,
            &model,
        ])
        .envs(env)
        .spawn()
        .expect("🙈 Failed to run swarm");
}

fn get_petals_path(handle: tauri::AppHandle) -> String {
    let binding = handle
        .path_resolver()
        .resolve_resource("petals")
        .expect("🙈 Failed to find `create_env.sh`");
    let petals_path = binding
        .to_str()
        .expect("🙈 Failed to convert petals path to str");
    petals_path.to_string()
}

pub fn get_swarm_processes() -> Vec<u64> {
    // Check if create_env.sh is running
    let output = Command::new("/usr/bin/pgrep")
        .args(&["-f", "create_env.sh|(mamba|conda).*create.*prem_app"])
        .output()
        .map_err(|e| {
            println!("🙈 Failed to execute command: {}", e);
            e
        });

    let output_value = output.unwrap().stdout;

    // If create_env.sh is running, return an empty string
    if !output_value.is_empty() {
        return vec![];
    }

    let config = Config::new();
    let python_path = PathBuf::from(config.python);
    let prem_app_env = python_path
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .to_str()
        .unwrap();

    let regex = format!("https://github.com/bigscience-workshop/petals|{prem_app_env}.*(petals.cli.run_server|multiprocessing.resource_tracker|from multiprocessing.spawn)");

    // If create_env.sh is not running, get the processes from petals
    let output = Command::new("/usr/bin/pgrep")
        .args(&["-f", &regex])
        .output()
        .map_err(|e| {
            println!("🙈 Failed to execute command: {}", e);
            e
        });

    let output_value = output.unwrap().stdout;
    let processes: Vec<u64> = output_value
        .replace("\n", " ")
        .split(" ")
        .collect::<Vec<&str>>()
        .into_iter()
        .filter_map(|s| s.parse::<u64>().ok())
        .collect();
    processes
}

#[tauri::command]
pub fn stop_swarm_mode() {
    println!("🛑 Stopping the Swarm...");
    let processes = get_swarm_processes();
    println!("🛑 Stopping Processes: {:?}", processes);

    for process in processes {
        let _ = Command::new("kill")
            .args(["-s", "SIGTERM", &process.to_string()])
            .spawn()
            .expect("🙈 Failed to execute kill command with SIGTERM");

        let handle: JoinHandle<_> = thread::spawn(move || {
            thread::sleep(Duration::from_millis(50));
            match Command::new("ps")
                .args(["-p", &process.to_string()])
                .output()
            {
                Ok(output) => match output.status.code() {
                    Some(0) => true,
                    _ => false,
                },
                Err(e) => {
                    eprintln!("Error executing ps command: {}", e);
                    false
                }
            }
        });
        if handle.join().unwrap() {
            let _ = Command::new("kill")
                .args(["-s", "SIGKILL", &process.to_string()])
                .output()
                .expect("🙈 Failed to execute kill command with SIGKILL");
            println!("🛑 Stopping Process with SIGKILL: {}", process);
        } else {
            println!("🛑 Stopping Process with SIGTERM: {}", process);
        }
    }
    println!("🛑 Stopped all the Swarm Processes.");
}
