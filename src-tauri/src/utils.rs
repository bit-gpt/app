use crate::errors::{Context, Result};
use crate::{Service, SharedState};
use reqwest::get;
use std::collections::HashMap;
use tauri::State;
use tokio::fs;

pub async fn fetch_services_manifests(url: &str, state: &State<'_, SharedState>) -> Result<()> {
    let mut services_guard = state.services.lock().await;
    let response = get(url).await.expect("Failed to fetch registry");
    let service_ids = services_guard.keys().cloned().collect::<Vec<String>>();
    let services = response.json::<Vec<Service>>().await.unwrap();
    for service in services {
        if !service_ids.contains(&service.id.clone().unwrap()) {
            services_guard.insert(service.id.clone().unwrap(), service);
        }
    }
    Ok(())
}

pub async fn set_all_state_to_file(
    state: &State<'_, SharedState>,
    state_filepath: impl AsRef<str>,
) -> Result<()> {
    let services_guard = state.services.lock().await;
    let json = serde_json::to_string(&*services_guard).unwrap();
    fs::write(state_filepath.as_ref(), json)
        .await
        .with_context(|| {
            format!(
                "Failed to write state to file: {}",
                state_filepath.as_ref().to_string()
            )
        })?;
    Ok(())
}

pub async fn set_state_to_file(
    state_path: impl AsRef<str>,
    service_id: impl AsRef<str>,
    state_key: impl AsRef<str>,
    state_value: impl AsRef<str>,
) -> Result<()> {
    println!(
        "Set state property {} to {}",
        state_key.as_ref(),
        state_value.as_ref()
    );
    let json_bytes = fs::read(state_path.as_ref())
        .await
        .expect("Failed to read state from file");
    let json_string = String::from_utf8_lossy(&json_bytes).to_string();
    let mut services: HashMap<String, Service> =
        serde_json::from_str(&json_string).with_context(|| {
            format!(
                "Failed to parse state from file: {}",
                state_path.as_ref().to_string()
            )
        })?;
    if let Some(service) = services.get_mut(&service_id.as_ref().to_string()) {
        match state_key.as_ref() {
            "running" => {
                service.running = Some(state_value.as_ref().parse::<bool>().unwrap());
            }
            "downloaded" => {
                service.downloaded = Some(state_value.as_ref().parse::<bool>().unwrap());
            }
            _ => {}
        }
    }
    let json = serde_json::to_string(&services).with_context(|| {
        format!(
            "Failed to serialize state to json: {}",
            state_path.as_ref().to_string()
        )
    })?;
    fs::write(state_path.as_ref(), json)
        .await
        .with_context(|| {
            format!(
                "Failed to write state to file: {}",
                state_path.as_ref().to_string()
            )
        })?;
    Ok(())
}

pub fn is_aarch64() -> bool {
    cfg!(target_arch = "aarch64")
}

pub fn is_x86_64() -> bool {
    cfg!(target_arch = "x86_64")
}

pub fn get_binary_url(binaries_url: &HashMap<String, Option<String>>) -> String {
    let mut binary_url = "".to_string();
    if is_aarch64() {
        binary_url = binaries_url
            .get("aarch64-apple-darwin")
            .unwrap()
            .clone()
            .unwrap()
    } else if is_x86_64() {
        binary_url = binaries_url
            .get("x86_64-apple-darwin")
            .unwrap()
            .clone()
            .unwrap()
    } else {
        Err("Unsupported architecture").unwrap()
    }
    binary_url
}
