use crate::errors::{Result, ToResult};
use crate::{err, Service, SharedState};
use reqwest::get;
use std::collections::{HashMap, HashSet};
use std::path::Path;
use std::sync::Arc;

pub async fn fetch_services_manifests(url: &str, state: Arc<SharedState>) -> Result<()> {
    let response = get(url)
        .await
        .with_msg(|| format!("Couldn't fetch the manifest from {url:?}"))?;
    let services = response
        .json::<Vec<Service>>()
        .await
        .msg("Failed to parse response to list of services")?;
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
            .with_msg(|| "No binary available for platform")?
            .clone()
            .with_msg(|| "Service not supported on your platform")
    } else if is_x86_64() && is_macos() {
        binaries_url
            .get("x86_64-apple-darwin")
            .with_msg(|| "No binary available for platform")?
            .clone()
            .with_msg(|| "Service not supported on your platform")
    } else {
        err!("Unsupported architecture")
    }
}

pub async fn write_checksum_json_with_key(
    checksums: &Path,
    service_id: String,
    hashes: HashSet<String>,
) -> Result<()> {
    let mut map: HashMap<String, HashSet<String>> = serde_json::from_slice(
        &tokio::fs::read(checksums)
            .await
            .with_msg(|| format!("Failed to read from '{}'", checksums.display()))?,
    )
    .with_msg(|| format!("Failed to deserialize '{}'", checksums.display()))?;
    map.insert(service_id.to_string(), hashes);
    tokio::fs::write(
        checksums,
        serde_json::to_string(&map).msg("Failed to serialize")?,
    )
    .await
    .with_msg(|| format!("Failed to write to '{}'", checksums.display()))
}

pub async fn read_checksum_json_with_key(
    checksums_json_path: &Path,
    service_id: &str,
) -> Result<HashSet<String>> {
    let map: HashMap<String, HashSet<String>> = serde_json::from_slice(
        &tokio::fs::read(checksums_json_path)
            .await
            .with_msg(|| format!("Failed to read {}", checksums_json_path.display()))?,
    )
    .msg("Failed to deserialize checksums.json")?;
    map.get(service_id)
        .cloned()
        .msg("Service id not in checksums.json!")
}

/// hashes to hex
pub fn hash_str(src: impl AsRef<str>) -> String {
    use sha2::Digest;
    let mut hasher = sha2::Sha256::new();
    hasher.update(src.as_ref().as_bytes());
    format!("{:x}", hasher.finalize())
}
