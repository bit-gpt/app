// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::{
    download::Downloader,
    err,
    errors::{Context, Result},
    logerr,
    swarm::{create_environment, Config},
    utils, Registry, Service, SharedState,
};

use std::path::PathBuf;
use std::time::Duration;
use std::{collections::HashMap, sync::Arc};

use futures::future;

use sys_info::mem_info;
use sysinfo::{Pid, ProcessExt, ProcessRefreshKind, RefreshKind, SystemExt};

use tauri::{AppHandle, Runtime, State, Window};
use tauri_plugin_store::StoreBuilder;

use tokio::process::{Child, Command};
use tokio::time::interval;
use tokio::{fs, sync::Mutex};

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
    handle: tauri::AppHandle,
    service_id: String,
    state: State<'_, Arc<SharedState>>,
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
    let log_file = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .with_context(|| format!("Failed to open log file `{}`", log_path.display()))?;

    // Check if service is already running
    let running_services_guard = state.running_services.lock().await;
    if running_services_guard.contains_key(&service_id) {
        err!("Service with `{service_id}` already exist")
    }
    drop(running_services_guard);

    let services_guard = state.services.lock().await;
    let serve_command = services_guard
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
    let is_petals_model = services_guard
        .get(&service_id)
        .with_context(|| format!("service_id {} doesn't exist in registry", service_id))?
        .petals
        .unwrap_or_default();
    log::info!("serve_command: {}", serve_command);
    let serve_command_vec: Vec<&str> = serve_command.split_whitespace().collect();

    // Combine the service_dir and binary name to get the correct binary path
    let binary_path = PathBuf::from(&service_dir).join(&serve_command_vec[0]);
    log::info!("binary_path: {:?}", binary_path);
    if !binary_path.exists() {
        err!("invalid binary for `{service_id}`")
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

    let config = Config::new();
    let mut env_vars = HashMap::new();
    env_vars.insert("PREM_APPDIR".to_string(), config.app_data_dir);
    env_vars.insert("PREM_PYTHON".to_string(), config.python);

    if is_petals_model {
        create_environment(handle);
    }

    let child = Command::new(&binary_path)
        .current_dir(service_dir)
        .args(args)
        .envs(env_vars)
        .stdout(std::process::Stdio::from(
            log_file
                .try_clone()
                .with_context(|| "Failed to clone log file handle")?,
        ))
        .stderr(std::process::Stdio::from(log_file))
        .spawn()
        .map_err(|e| format!("Failed to spawn child process: {}", e))?;

    let skip_service_check = services_guard
        .get(&service_id)
        .map(|service| service.skip_health_check.unwrap_or(false))
        .unwrap();

    if skip_service_check {
        let mut running_services_guard = state.running_services.lock().await;
        running_services_guard.insert(service_id.clone(), child);
        log::info!("Service started: {}", service_id);
    } else {
        // Check if the service is running calling /v1 endpoint every 500ms
        let interval_duration = Duration::from_millis(500);
        let mut interval = interval(interval_duration);
        loop {
            interval.tick().await;
            let base_url = get_base_url(&services_guard[&service_id])?;
            let url = format!("{}/v1", base_url);
            let client = reqwest::Client::new();
            let res = client.get(&url).send().await;
            match res {
                Ok(response) => {
                    // If /v1 is not implemented by the service, it will return 400 Bad Request, consider it as success
                    if response.status().is_success()
                        || response.status() == reqwest::StatusCode::BAD_REQUEST
                    {
                        let mut running_services_guard = state.running_services.lock().await;
                        running_services_guard.insert(service_id.clone(), child);
                        log::info!("Service started: {}", service_id);
                        break;
                    } else {
                        log::error!("Service failed to start: {}", service_id);
                    }
                }
                Err(e) => {
                    log::error!("Failed to send request: {}", e);
                }
            }
        }
    }
    Ok(())
}

#[tauri::command(async)]
pub async fn stop_service(service_id: String, state: State<'_, Arc<SharedState>>) -> Result<()> {
    let running_services = &state.running_services;
    let services = &state.services;
    _stop_service(service_id.as_str(), running_services, services).await
}

async fn _stop_service(
    service_id: &str,
    running_services: &Mutex<HashMap<String, Child>>,
    services: &Mutex<HashMap<String, Service>>,
) -> Result<()> {
    log::info!("stopping service service_id = {service_id}");
    let mut running_services_guard = running_services.lock().await;
    let Some(mut child) = running_services_guard.remove(service_id) else {
        err!("Service not running")
    };
    // kill the process gracefully using SIGTERM/SIGINT
    let Some(pid) = child.id() else {
        err!("Service couldn't be stopped: {}", service_id)
    };
    log::info!("service pid = {pid}");
    let system = sysinfo::System::new_with_specifics(
        RefreshKind::new().with_processes(ProcessRefreshKind::new()),
    );
    let process = system
        .process(Pid::from(pid as usize))
        .with_context(|| format!("Process pid({}) invalid", pid))?;
    log::info!(
        "terminating service: process_name({}) process_id({})",
        process.name(),
        process.pid()
    );
    if !process
        .kill_with(sysinfo::Signal::Term)
        .with_context(|| format!("Couldn't send terminate signal to process(pid: {}).", pid))?
    {
        err!("Failed to kill the process");
    }
    let mut registry_lock = services.lock().await;
    if let Some(service) = registry_lock.get_mut(service_id) {
        service.running = Some(false);
    }
    // wait for process to properly exit
    if let Ok(_exit_code) = child.try_wait() {
        log::info!("service stopped!");
    } else if let Ok(_exit_code) = child.wait().await {
        log::info!("service stopped!");
    }
    Ok(())
}

pub fn stop_all_services(state: Arc<SharedState>) {
    log::info!("Stopping all services");
    tauri::async_runtime::block_on(async move {
        let keys = state
            .running_services
            .lock()
            .await
            .keys()
            .cloned()
            .collect::<Vec<String>>();
        for service_id in keys {
            logerr!(
                _stop_service(
                    service_id.as_str(),
                    &state.running_services,
                    &state.services
                )
                .await
            );
        }
    });
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
    state: State<'_, Arc<SharedState>>,
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
    state: State<'_, Arc<SharedState>>,
    app_handle: AppHandle,
) -> Result<Service> {
    let services = state.services.lock().await;
    let mut service = services[&service_id].clone();
    update_service_with_dynamic_state(&mut service, &state, &app_handle).await?;
    Ok(service)
}

// Dynamic service state
#[tauri::command(async)]
pub async fn get_running_services(state: State<'_, Arc<SharedState>>) -> Result<Vec<String>> {
    let services = state.running_services.lock().await;
    return Ok(services.keys().cloned().collect());
}

pub async fn is_service_running(
    service_id: &str,
    state: &State<'_, Arc<SharedState>>,
) -> Result<bool> {
    let running_services = state.running_services.lock().await;
    return Ok(running_services.contains_key(service_id));
}

pub async fn is_service_downloaded(service: &Service, app_handle: &AppHandle) -> Result<bool> {
    let service_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .with_context(|| "Failed to resolve app data dir")?
        .join("models")
        .join(service.get_id_ref()?);
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
                .map_err(|_| format!("Failed HEAD request: {}", url))?;
            if response.status().is_success() {
                if let Some(remote_file_size) = response.headers().get("Content-Length") {
                    let parsed_size = remote_file_size
                        .to_str()
                        .with_context(|| "Header value remote_file_size not utf-8")?
                        .parse::<u64>()
                        .with_context(|| {
                            format!(
                                "Failed to parse header-value({:?}) as u64",
                                remote_file_size.to_str()
                            )
                        })?;
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

pub async fn is_supported(service: &Service) -> Result<bool> {
    // Check if there is a binary for the current platform
    let binary_url = match service.binaries_url.as_ref() {
        Some(binaries_url) => utils::get_binary_url(&binaries_url),
        None => err!(
            "No binaries_url found for service: {}",
            service.get_id_ref()?
        ),
    };
    Ok(binary_url.is_ok())
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
    state: &State<'_, Arc<SharedState>>,
    app_handle: &AppHandle,
) -> Result<Service> {
    let is_service_downloaded = is_service_downloaded(service, &app_handle).await?;
    let has_enough_free_memory = has_enough_free_memory(service).await?;
    let has_enough_total_memory = has_enough_total_memory(service).await?;
    let has_enough_storage = has_enough_storage().await?;
    let is_supported = is_supported(service).await?;
    let is_service_running = is_service_running(service.get_id_ref()?, &state).await?;
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
pub async fn get_service_stats(_service_id: String) -> Result<HashMap<String, String>> {
    Ok(HashMap::new())
}
#[tauri::command(async)]
pub async fn get_gpu_stats() -> Result<HashMap<String, String>> {
    Ok(HashMap::new())
}

#[tauri::command(async)]
pub async fn add_service(service: Service, state: State<'_, Arc<SharedState>>) -> Result<()> {
    let mut services_guard = state.services.lock().await;
    services_guard.insert(service.get_id()?, service);
    Ok(())
}

#[tauri::command(async)]
pub async fn add_registry(
    registry: Registry,
    app_handle: AppHandle,
    state: State<'_, Arc<SharedState>>,
) -> Result<()> {
    let store_path = app_handle
        .path_resolver()
        .app_data_dir()
        .with_context(|| "Failed to resolve app data dir")?
        .join("store.json");
    let mut store = StoreBuilder::new(app_handle, store_path).build();
    store.load().with_context(|| "Failed to load store")?;
    if let Some(registries) = store.get("registries").cloned() {
        match serde_json::from_value::<Vec<Registry>>(registries) {
            Ok(mut registries) => {
                registries.push(registry);
                store
                    .insert(
                        "registries".to_string(),
                        serde_json::to_value(&registries).unwrap(),
                    )
                    .with_context(|| "Failed to insert into store")?;
                utils::fetch_all_services_manifests(&registries, &state)
                    .await
                    .expect("failed to fetch services")
            }
            Err(e) => println!("Error unwrapping registries: {:?}", e),
        }
    } else {
        let new_registry = [registry];
        store
            .insert(
                "registries".to_string(),
                serde_json::to_value(&new_registry).unwrap(),
            )
            .with_context(|| "Failed to insert into store")?;
        utils::fetch_all_services_manifests(&new_registry, &state)
            .await
            .expect("failed to fetch services")
    }
    store.save().expect("failed to save store");
    Ok(())
}

#[tauri::command(async)]
pub async fn delete_registry(
    registry: Registry,
    app_handle: AppHandle,
    state: State<'_, Arc<SharedState>>,
) -> Result<()> {
    let store_path = app_handle
        .path_resolver()
        .app_data_dir()
        .with_context(|| "Failed to resolve app data dir")?
        .join("store.json");
    let mut store = StoreBuilder::new(app_handle, store_path).build();
    store.load().with_context(|| "Failed to load store")?;
    if let Some(registries) = store.get("registries").cloned() {
        let mut registries = serde_json::from_value::<Vec<Registry>>(registries)
            .with_context(|| "Failed to deserialize")?;
        registries.retain(|r| r.url != registry.url);
        store
            .insert(
                "registries".to_string(),
                serde_json::to_value(registries).with_context(|| "Failed to serialize")?,
            )
            .with_context(|| "Failed to insert into store")?;
        store.save().with_context(|| "Failed to save store")?;

        // Reset services state and refetch all registries
        let mut services_guard = state.services.lock().await;
        services_guard.clear();
        drop(services_guard);
        if let Some(registries) = store.get("registries").cloned() {
            match serde_json::from_value::<Vec<Registry>>(registries) {
                Ok(registries) => utils::fetch_all_services_manifests(&registries, &state)
                    .await
                    .with_context(|| "Failed to fetch services")?,
                Err(e) => log::error!("Error unwrapping registries: {:?}", e),
            }
        } else {
            println!("No registries found");
        }
    }
    Ok(())
}

#[tauri::command(async)]
pub async fn fetch_registries(app_handle: AppHandle) -> Result<Vec<Registry>> {
    let store_path = app_handle
        .path_resolver()
        .app_data_dir()
        .with_context(|| "Failed to resolve app data dir")?
        .join("store.json");
    let mut store = StoreBuilder::new(app_handle, store_path).build();
    match store.load() {
        Ok(_) => {
            if let Some(registries) = store.get("registries").cloned() {
                match serde_json::from_value::<Vec<Registry>>(registries) {
                    Ok(registries) => Ok(registries),
                    Err(e) => {
                        log::error!("Error unwrapping registries: {:?}", e);
                        Ok(Vec::new())
                    }
                }
            } else {
                log::error!("No registries found");
                Ok(Vec::new())
            }
        }
        Err(e) => {
            log::error!("Error loading store: {:?}", e);
            Ok(Vec::new())
        }
    }
}

#[tauri::command(async)]
pub async fn reset_default_registry(
    app_handle: AppHandle,
    state: State<'_, Arc<SharedState>>,
) -> Result<()> {
    let store_path = app_handle
        .path_resolver()
        .app_data_dir()
        .with_context(|| "Failed to resolve app data dir")?
        .join("store.json");
    let mut store = StoreBuilder::new(app_handle.clone(), store_path).build();
    store.load().with_context(|| "Failed to load store")?;
    store
        .delete("registries")
        .with_context(|| "Failed to delete registries")?;
    store.save().with_context(|| "Failed to save store")?;
    add_registry(Registry::default(), app_handle.clone(), state)
        .await
        .with_context(|| "Failed to add default registry")?;
    Ok(())
}
