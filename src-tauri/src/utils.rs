use crate::{Service, SharedState};
use reqwest::get;
use tauri::State;

pub async fn add_services_from_registry(
    url: &str,
    state: &State<'_, SharedState>,
) -> Result<(), reqwest::Error> {
    let mut registry = state.services.lock().await;
    let response = get(url).await.expect("Failed to fetch registry");
    let service_ids = registry.keys().cloned().collect::<Vec<String>>();
    let services = response.json::<Vec<Service>>().await.unwrap();
    // TODO: avoid cloning if possible
    for service in services {
        if !service_ids.contains(&service.id.clone().unwrap()) {
            registry.insert(service.id.clone().unwrap(), service);
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
