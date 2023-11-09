use crate::errors::{Context, Result};
use crate::{err, Registry, Service, SharedState};
use futures::future;
use reqwest::get;
use std::collections::HashMap;
use std::sync::Arc;

pub async fn fetch_all_services_manifests(
    registries: &[Registry],
    state: &Arc<SharedState>,
) -> Result<()> {
    let mut handlers = vec![];
    for registry in registries {
        let handler = async move {
            if let Err(err) = fetch_services_manifests(registry.url.as_str(), state).await {
                println!(
                    "Failed to fetch {} and save services manifests: {}",
                    registry.url, err
                );
            }
        };
        handlers.push(handler);
    }
    future::join_all(handlers).await;
    Ok(())
}

async fn fetch_services_manifests(url: &str, state: &Arc<SharedState>) -> Result<()> {
    let response = get(url)
        .await
        .with_context(|| format!("Couldn't fetch the manifest from {url:?}"))?;
    let services = response
        .json::<Vec<Service>>()
        .await
        .with_context(|| "Failed to parse response to list of services")?;
    let mut services_guard = state.services.lock().await;
    for service in services {
        if !service
            .get_id_ref()
            .map(|id| services_guard.contains_key(id))
            .unwrap_or_default()
        {
            services_guard.insert(service.get_id()?, service);
        }
    }
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
    } else if is_macos() {
        if is_x86_64() {
            binaries_url.get("x86_64-apple-darwin").cloned().flatten()
        } else if is_aarch64() {
            binaries_url.get("aarch64-apple-darwin").cloned().flatten()
        } else {
            err!("Unsupported architecture")
        }
        .or_else(|| {
            binaries_url
                .get("universal-apple-darwin")
                .cloned()
                .flatten()
        })
        .with_context(|| "Service not supported on your platform")
    } else {
        err!("Unsupported platform")
    }
}

#[cfg(all(test, target_os = "macos"))]
mod tests {
    use super::get_binary_url;
    use std::collections::HashMap;

    #[test]
    fn binary_url_test_universal_only() {
        let url = get_binary_url(&HashMap::from_iter([(
            "universal-apple-darwin".to_string(),
            Some("randome_url.com".to_string()),
        )]))
        .unwrap();
        assert_eq!(url, "randome_url.com");
    }

    #[test]
    fn binary_url_test_universal_only_option() {
        let url = get_binary_url(&HashMap::from_iter([
            (
                "universal-apple-darwin".to_string(),
                Some("randome_url.com".to_string()),
            ),
            ("aarch64-apple-darwin".to_string(), None),
            ("x86_64-apple-darwin".to_string(), None),
        ]))
        .unwrap();
        assert_eq!(url, "randome_url.com");
    }

    #[test]
    fn binary_url_test_with_non_universal() {
        let url = get_binary_url(&HashMap::from_iter([
            (
                "universal-apple-darwin".to_string(),
                Some("randome_url.com//universal".to_string()),
            ),
            (
                "aarch64-apple-darwin".to_string(),
                Some("randome_url.com//not_universal".to_string()),
            ),
            (
                "x86_64-apple-darwin".to_string(),
                Some("randome_url.com//not_universal".to_string()),
            ),
        ]))
        .unwrap();
        assert_eq!(url, "randome_url.com//not_universal");
    }

    #[test]
    #[should_panic]
    fn binary_url_test_empty() {
        let url = get_binary_url(&HashMap::from_iter([])).unwrap();
        assert_eq!(url, "randome_url.com");
    }

    #[test]
    fn binary_url_all_none() {
        let err = get_binary_url(&HashMap::from_iter([
            ("universal-apple-darwin".to_string(), None),
            ("aarch64-apple-darwin".to_string(), None),
            ("x86_64-apple-darwin".to_string(), None),
        ]));
        assert_eq!(
            err.err().map(|err| err.to_string()).unwrap_or_default(),
            "Service not supported on your platform"
        );
    }
}
