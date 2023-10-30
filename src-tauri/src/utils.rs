use crate::errors::{Context, Result};
use crate::{err, Service, SharedState};
use reqwest::get;
use std::collections::HashMap;
use std::sync::Arc;

pub async fn fetch_services_manifests(url: &str, state: Arc<SharedState>) -> Result<()> {
    let response = get(url)
        .await
        .with_context(|| format!("Couldn't fetch the manifest from {url:?}"))?;
    let services = response
        .json::<Vec<Service>>()
        .await
        .with_context(|| "Failed to parse response to list of services")?;
    let mut services_guard = state.services.lock().await;
    // TODO: discuss why do we need global ids, why not use uuids and generate them on each load
    *services_guard = services
        .into_iter()
        // removes services without id
        .filter_map(|x| Some((x.id.clone()?, x)))
        // removes duplicate services
        .collect();
    Ok(())
}

pub const fn is_aarch64() -> bool {
    cfg!(target_arch = "aarch64")
}

pub const fn is_x86_64() -> bool {
    cfg!(target_arch = "x86_64")
}

pub const fn is_macos() -> bool {
    cfg!(target_os = "macos")
}

pub const fn is_unix() -> bool {
    cfg!(target_family = "unix")
}

pub fn get_binary_url(binaries_url: &HashMap<String, Option<String>>) -> Result<String> {
    if !is_unix() && !is_macos() {
        err!("Unsupported OS")
    } else if is_aarch64() && is_macos() {
        binaries_url
            .get("aarch64-apple-darwin")
            .with_context(|| "No binary available for platform")?
            .clone()
            .with_context(|| "Service not supported on your platform")
    } else if is_x86_64() && is_macos() {
        binaries_url
            .get("x86_64-apple-darwin")
            .with_context(|| "No binary available for platform")?
            .clone()
            .with_context(|| "Service not supported on your platform")
    } else {
        err!("Unsupported architecture")
    }
}
