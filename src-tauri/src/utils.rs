use crate::errors::Result;
use crate::{Service, SharedState};
use reqwest::get;
use std::collections::HashMap;
use tauri::State;

pub async fn fetch_services_manifests(url: &str, state: &State<'_, SharedState>) -> Result<()> {
    let response = get(url).await.expect("Failed to fetch registry");
    let services = response.json::<Vec<Service>>().await.unwrap();
    let mut services_guard = state.services.lock().await;
    let service_ids = services_guard.keys().cloned().collect::<Vec<String>>();
    for service in services {
        if !service_ids.contains(&service.id.clone().unwrap()) {
            services_guard.insert(service.id.clone().unwrap(), service);
        }
    }
    Ok(())
}

pub fn is_aarch64() -> bool {
    cfg!(target_arch = "aarch64")
}

pub fn is_x86_64() -> bool {
    cfg!(target_arch = "x86_64")
}

pub fn get_binary_url(binaries_url: &HashMap<String, Option<String>>) -> Result<String> {
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
    Ok(binary_url)
}
