// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::download::Downloader;
use crate::errors::{Context, Result};
use crate::{Service, SharedState};
use std::collections::HashMap;
use std::path::PathBuf;
use std::process::Stdio;
use sys_info::mem_info;

use futures::future;
use tauri::{AppHandle, Runtime, State, Window};
use tokio::{fs, process::Command};

#[tauri::command(async)]
pub async fn download_service<R: Runtime>(
    binaries_url: HashMap<String, Option<String>>,
    weights_directory_url: String,
    weights_files: Vec<String>,
    service_id: &str,
    app_handle: AppHandle,
    window: Window<R>,
) -> Result<()> {
    let service_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("models")
        .join(&service_id);

    let Some(service_dir) = service_dir.to_str() else {
        Err("`service_dir` path contains non utf-8 sequence".to_string())?
    };

    Downloader::new(
        binaries_url,
        weights_directory_url,
        weights_files,
        service_id,
        service_dir,
        window,
    )
    .download_files()
    .await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn start_service(
    service_id: String,
    state: State<'_, SharedState>,
    app_handle: AppHandle,
) -> Result<()> {
    let service_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("models")
        .join(&service_id);
    let log_path = PathBuf::from(&service_dir).join(format!("{}.log", service_id));

    // Use synchronous std::fs::File for log file creation
    let _log_file = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .with_context(|| format!("Failed to open log file `{}`", log_path.display()))?;

    // Check if service is already running
    let services = state.running_services.lock().await;
    if services.contains_key(&service_id) {
        Err(format!("Service with `{service_id}` doesn't exist"))?
    }
    drop(services); // Drop the lock before we proceed

    let registry_lock = state.services.lock().await;
    let serve_command = registry_lock
        .get(&service_id)
        .with_context(|| format!("service_id {} doesn't exist in registry", service_id))?
        .serve_command
        .as_ref()
        .with_context(|| {
            format!(
                "service_id {} doesn't contain a valid serve_command",
                service_id
            )
        })?
        .as_str();
    log::info!("serve_command: {}", serve_command);
    let serve_command_vec: Vec<&str> = serve_command.split_whitespace().collect();

    // Combine the service_dir and binary name to get the correct binary path
    let binary_path = PathBuf::from(&service_dir).join(&serve_command_vec[0]);
    log::info!("binary_path: {:?}", binary_path);
    if !binary_path.exists() {
        Err(format!("invalid binary for `{service_id}`"))?
    }
    // Extract the arguments with different delimiters
    let args: Vec<String> = serve_command_vec[1..]
        .iter()
        .map(|arg| {
            // Check if the argument contains '='
            if arg.contains('=') {
                arg.to_string()
            } else {
                // If the argument doesn't contain '=', it should be treated as a separate argument
                arg.split(' ')
                    .map(String::from)
                    .collect::<Vec<String>>()
                    .join(" ")
            }
        })
        .collect();
    log::info!("args: {:?}", args);
    let child = Command::new(&binary_path)
        .current_dir(service_dir)
        .args(args)
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .spawn()
        .map_err(|e| format!("Failed to spawn child process: {}", e))?;
    let mut running_services_guard = state.running_services.lock().await;
    running_services_guard.insert(service_id, child);
    Ok(())
}

#[tauri::command(async)]
pub async fn stop_service(service_id: String, state: State<'_, SharedState>) -> Result<()> {
    let mut services = state.running_services.lock().await;
    if let Some(mut child) = services.remove(&service_id) {
        child.kill().await.map_err(|e| e.to_string())?;
    }
    let mut registry_lock = state.services.lock().await;
    if let Some(service) = registry_lock.get_mut(&service_id) {
        service.running = Some(false);
    }
    Ok(())
}

pub fn stop_all_services(state: tauri::State<'_, SharedState>) {
    tauri::async_runtime::block_on(async move {
        let services = state.running_services.lock().await;
        for service_id in services.keys() {
            _ = stop_service(service_id.clone(), state.clone()).await;
        }
    })
}

#[tauri::command(async)]
pub async fn delete_service(service_id: String, app_handle: AppHandle) -> Result<()> {
    let dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("models")
        .join(&service_id);
    fs::remove_dir_all(dir).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command(async)]
pub async fn get_logs_for_service(service_id: String, app_handle: AppHandle) -> Result<String> {
    let log_path = app_handle
        .path_resolver()
        .app_data_dir()
        .with_context(|| "failed to get app data dir")?
        .join(format!("{}.log", service_id));
    let logs = tokio::fs::read_to_string(log_path)
        .await
        .map_err(|e| e.to_string())?;
    Ok(logs)
}

#[tauri::command]
pub async fn get_services(
    state: State<'_, SharedState>,
    app_handle: AppHandle,
) -> Result<Vec<Service>> {
    let mut services = Vec::new();
    let mut update_futures = Vec::new();
    let services_guard = state.services.lock().await;

    for service in services_guard.values() {
        // Update services only if version is 1
        if let Some(version) = &service.version {
            if version == "1" {
                let state_ref = &state;
                let app_handle_ref = &app_handle;
                let mut service_clone = service.clone();
                let update_future = async move {
                    update_service_with_dynamic_state(&mut service_clone, state_ref, app_handle_ref)
                        .await
                };
                update_futures.push(update_future);
            }
        } else {
            services.push(service.clone())
        }
    }

    let results = future::join_all(update_futures).await;

    for result in results {
        match result {
            Ok(service) => {
                services.push(service);
            }
            Err(err) => log::error!("Update service error: {:?}", err),
        }
    }
    Ok(services)
}

#[tauri::command(async)]
pub async fn get_service_by_id(
    service_id: String,
    state: State<'_, SharedState>,
    app_handle: AppHandle,
) -> Result<Service> {
    let services = state.services.lock().await;
    let mut service = services[&service_id].clone();
    update_service_with_dynamic_state(&mut service, &state, &app_handle).await?;
    Ok(service)
}

// Dynamic service state
#[tauri::command(async)]
pub async fn get_running_services(state: State<'_, SharedState>) -> Result<Vec<String>> {
    let services = state.running_services.lock().await;
    return Ok(services.keys().cloned().collect());
}

pub async fn is_service_running(service_id: &str, state: &State<'_, SharedState>) -> Result<bool> {
    let running_services = state.running_services.lock().await;
    return Ok(running_services.contains_key(service_id));
}

pub async fn is_service_downloaded(service: &Service, app_handle: &AppHandle) -> Result<bool> {
    let service_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("models")
        .join(&service.id.as_ref().unwrap());
    let mut downloaded = true;
    for file in &service.weights_files.clone().unwrap() {
        let file_path = service_dir.join(file);
        if !file_path.exists() {
            downloaded = false;
            break;
        } else {
            // compare size of file with remote file size using HEAD requests
            let file_size_on_disk = file_path.metadata().unwrap().len();
            let client = reqwest::Client::new();
            let weights_dir_url = service.weights_directory_url.as_ref().unwrap();
            // Remove trailing slash from weights_directory_url if it exists
            let weights_dir_url = if weights_dir_url.ends_with("/") {
                &weights_dir_url[..weights_dir_url.len() - 1]
            } else {
                weights_dir_url
            };
            let url = &format!("{}/{}", weights_dir_url, file);
            let response = client
                .head(url)
                .send()
                .await
                .map_err(|_| format!("Failed HEAD request: {}", url))
                .unwrap();
            if response.status().is_success() {
                if let Some(remote_file_size) = response.headers().get("Content-Length") {
                    let parsed_size = remote_file_size.to_str().unwrap().parse::<u64>().unwrap();
                    // println!("Content-Length: {:?}", parsed_size);
                    if file_size_on_disk != parsed_size {
                        downloaded = false;
                        break;
                    }
                } else {
                    log::error!("Content-Length header not found.");
                }
            } else {
                log::error!("Request failed with status code: {}", response.status());
            }
        }
    }
    return Ok(downloaded);
}

pub async fn has_enough_free_memory(service: &Service) -> Result<bool> {
    let mem_info = mem_info().with_context(|| "Failed to get memory info")?;
    let memory_requirements = service.model_info.memory_requirements.unwrap_or(0);
    let has_enough_memory = mem_info.free >= memory_requirements as u64;
    Ok(has_enough_memory)
}

pub async fn has_enough_total_memory(service: &Service) -> Result<bool> {
    let mem_info = mem_info().with_context(|| "Failed to get memory info")?;
    let memory_requirements = service.model_info.memory_requirements.unwrap_or(0);
    let has_enough_memory = mem_info.total >= memory_requirements as u64;
    Ok(has_enough_memory)
}

pub async fn has_enough_storage() -> Result<bool> {
    // TODO: Not implemented yet
    Ok(true)
}

pub async fn is_supported() -> Result<bool> {
    // TODO: Not implemented yet
    Ok(true)
}

pub fn get_base_url(service: &Service) -> Result<String> {
    let base_url = format!(
        "http://localhost:{:?}",
        service.default_external_port.unwrap_or_default()
    );
    Ok(base_url)
}

pub async fn update_service_with_dynamic_state(
    service: &mut Service,
    state: &State<'_, SharedState>,
    app_handle: &AppHandle,
) -> Result<Service> {
    let is_service_downloaded = is_service_downloaded(service, &app_handle).await?;
    let has_enough_free_memory = has_enough_free_memory(service).await?;
    let has_enough_total_memory = has_enough_total_memory(service).await?;
    let has_enough_storage = has_enough_storage().await?;
    let is_supported = is_supported().await?;
    let is_service_running = is_service_running(&service.id.as_ref().unwrap(), &state).await?;
    let base_url = get_base_url(service)?;
    service.downloaded = Some(is_service_downloaded);
    service.enough_memory = Some(has_enough_free_memory);
    service.enough_system_memory = Some(has_enough_total_memory);
    service.enough_storage = Some(has_enough_storage);
    service.supported = Some(is_supported);
    service.running = Some(is_service_running);
    service.base_url = Some(base_url);
    Ok(service.clone())
}

#[tauri::command(async)]
pub async fn get_system_stats() -> Result<HashMap<String, String>> {
    Ok(HashMap::new())
}

#[tauri::command(async)]
pub async fn get_service_stats(service_id: String) -> Result<HashMap<String, String>> {
    log::info!("service_id: {}", service_id);
    Ok(HashMap::new())
}

#[tauri::command(async)]
pub async fn get_gpu_stats() -> Result<HashMap<String, String>> {
    Ok(HashMap::new())
}
