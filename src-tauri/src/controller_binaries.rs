// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::path::PathBuf;

use crate::download::Downloader;
use crate::errors::{Context, Result};
use crate::{Service, SharedState};

use crate::utils::set_state_to_file;
use tauri::{Runtime, Window};
use tokio::{fs, process::Command};

#[tauri::command(async)]
pub async fn download_service<R: Runtime>(
    binaries_url: HashMap<String, Option<String>>,
    weights_directory_url: String,
    weights_files: Vec<String>,
    service_id: &str,
    app_handle: tauri::AppHandle,
    state: tauri::State<'_, SharedState>,
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

    let state_filepath = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("state.json");

    let mut registry_lock = state.services.lock().await;
    if let Some(service) = registry_lock.get_mut(service_id) {
        service.downloaded = Some(true);
        set_state_to_file(
            state_filepath.display().to_string(),
            service_id,
            "downloaded",
            "true",
        )
        .await?;
    }
    Ok(())
}

#[tauri::command(async)]
pub async fn start_service(
    service_id: String,
    state: tauri::State<'_, SharedState>,
    app_handle: tauri::AppHandle,
) -> Result<()> {
    let service_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("models")
        .join(&service_id);
    let log_path = PathBuf::from(&service_dir).join(format!("{}.log", service_id));

    // Use synchronous std::fs::File for log file creation
    let log_file = std::fs::OpenOptions::new()
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
        .with_context(|| format!("service_id ({service_id}) doesn't exist in registry"))?
        .serve_command
        .as_ref()
        .with_context(|| {
            format!("service_id ({service_id}) doesn't contain a valid serve_command")
        })?
        .as_str();
    println!("serve_command: {}", serve_command);
    let serve_command_vec: Vec<&str> = serve_command.split_whitespace().collect();
    let binary_path = PathBuf::from(&service_dir).join(&serve_command_vec[0]);
    if !binary_path.exists() {
        Err(format!("invalid binary for `{service_id}`"))?
    }

    let child = Command::new(&binary_path)
        .args(vec![
            serve_command_vec[1],
            format!("{}={}", serve_command_vec[2], service_dir.display()).as_str(),
            format!("{}={}", serve_command_vec[4], serve_command_vec[5]).as_str(),
        ])
        .stdout(std::process::Stdio::from(
            log_file
                .try_clone()
                .with_context(|| "Failed to clone log file handle")?,
        ))
        .stderr(std::process::Stdio::from(log_file))
        .spawn()
        .map_err(|e| format!("Failed to spawn child process: {}", e))?;
    let mut services = state.running_services.lock().await;
    services.insert(service_id.clone(), child);
    // Update status to "running"
    let mut registry_lock = state.services.lock().await;
    if let Some(service) = registry_lock.get_mut(&service_id) {
        service.running = Some(true);
    }
    Ok(())
}

#[tauri::command(async)]
pub async fn stop_service(service_id: String, state: tauri::State<'_, SharedState>) -> Result<()> {
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

pub async fn stop_all_services(state: tauri::State<'_, SharedState>) -> Result<()> {
    let services = state.running_services.lock().await;
    for service_id in services.keys() {
        stop_service(service_id.clone(), state.clone()).await?;
    }
    Ok(())
}

#[tauri::command(async)]
pub async fn delete_service(service_id: String, app_handle: tauri::AppHandle) -> Result<()> {
    let dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("failed to resolve app data dir")
        .join("binaries")
        .join(&service_id);
    fs::remove_dir(dir).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command(async)]
pub async fn get_logs_for_service(service_id: String) -> Result<String> {
    let log_path = dirs::data_dir()
        .with_context(|| "failed to get app data dir")?
        .join(format!("{}.log", service_id));
    let logs = tokio::fs::read_to_string(log_path)
        .await
        .map_err(|e| e.to_string())?;
    Ok(logs)
}

#[tauri::command(async)]
pub async fn get_services(state: tauri::State<'_, SharedState>) -> Result<Vec<Service>> {
    let services = state.services.lock().await;
    // TODO: Hack to update tabby_codellama_7B service
    let mut tabby_codellama_7b = services["tabby-codellama-7B"].clone();
    tabby_codellama_7b.supported = Some(true);
    tabby_codellama_7b.enough_memory = Some(true);
    tabby_codellama_7b.enough_system_memory = Some(true);
    let mut services = services.clone();
    services.insert("tabby-codellama-7B".to_string(), tabby_codellama_7b);
    return Ok(services
        .values()
        .filter(|service| service.version.is_some() && service.version.clone().unwrap() == "1")
        .cloned()
        .collect());
}

#[tauri::command(async)]
pub async fn get_service_by_id(
    service_id: String,
    state: tauri::State<'_, SharedState>,
) -> Result<Service> {
    let services = state.services.lock().await;
    // TODO: Hack to update tabby_codellama_7B service
    let mut tabby_codellama_7b = services["tabby-codellama-7B"].clone();
    tabby_codellama_7b.supported = Some(true);
    tabby_codellama_7b.enough_memory = Some(true);
    tabby_codellama_7b.enough_system_memory = Some(true);
    let mut services = services.clone();
    services.insert("tabby-codellama-7B".to_string(), tabby_codellama_7b);
    return Ok(services[&service_id].clone());
}

#[tauri::command(async)]
pub async fn get_running_services(state: tauri::State<'_, SharedState>) -> Result<Vec<String>> {
    let services = state.running_services.lock().await;
    return Ok(services.keys().cloned().collect());
}
