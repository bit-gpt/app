use std::{fs::File, io::Write};

use crate::errors::{Context, Result};

use futures::StreamExt;
use serde::Serialize;
use tauri::{Runtime, Window};

pub enum Registry {
    HuggingFace,
    // add other registries
    // OtherRegistry
}
impl Registry {
    fn build_download_url(&self, hugging_face_id: &str, file: &str) -> String {
        match self {
            Registry::HuggingFace => format!(
                "https://huggingface.co/{}/resolve/main/{}",
                hugging_face_id, file
            ),
            // add other registry path support
            // Registry::OtherRegistry => format!("other-registry-url")
        }
    }
}

pub struct Downloader<R: Runtime> {
    hugging_face_id: String,
    model_files: Vec<String>,
    service_id: String,
    service_dir: String,
    registry: Registry,
    window: Window<R>,
}

#[derive(Clone, Serialize)]
struct ProgressPayload {
    path: String,
    service_id: String,
    downloaded: u64,
    total: u64,
}

impl<R: Runtime> Downloader<R> {
    pub fn new(
        hugging_face_id: impl AsRef<str>,
        model_files: Vec<String>,
        service_id: impl AsRef<str>,
        service_dir: impl AsRef<str>,
        window: Window<R>,
    ) -> Self {
        Self {
            hugging_face_id: hugging_face_id.as_ref().to_string(),
            model_files: model_files.to_vec(),
            service_id: service_id.as_ref().to_string(),
            service_dir: service_dir.as_ref().to_string(),
            registry: Registry::HuggingFace,
            window,
        }
    }

    /// use to change the registry dynamically
    pub fn set_registry(&mut self, registry: Registry) {
        self.registry = registry;
    }

    pub async fn download_ggml_files(&self) -> Result<()> {
        self.download_files(&self.model_files).await
    }

    async fn download_files(&self, files: &[impl AsRef<str>]) -> Result<()> {
        futures::future::join_all(files.into_iter().map(|filename| {
            let url = self
                .registry
                .build_download_url(&self.hugging_face_id, filename.as_ref());
            self.download_file(url, format!("{}/{}", self.service_dir, filename.as_ref()))
        }))
        .await
        .into_iter()
        .collect()
    }

    async fn download_file(&self, url: impl AsRef<str>, path: impl AsRef<str>) -> Result<()> {
        // if file exists, no need to download
        let lockfile_path = format!("{}.prem.lock", path.as_ref());
        if tokio::fs::metadata(&lockfile_path).await.is_ok()
            || tokio::fs::metadata(path.as_ref()).await.is_ok()
        {
            Err(format!("File at: `{}`, already exists.", path.as_ref()))?
        } else {
            // this is in limited scope as this ensure
            // this flushes as early as possible
            _ = tokio::fs::File::create(&lockfile_path).await;
        }

        // create the path to the file
        let dirs;
        if let Some(last_slash) = path.as_ref().rfind('/') {
            dirs = &path.as_ref()[..last_slash];
            if let Err(e) = tokio::fs::create_dir_all(dirs).await {
                println!("Error creating directory: {:?}", e);
                if e.kind() != std::io::ErrorKind::AlreadyExists {
                    eprintln!("Error creating directory: {:?}", e);
                }
            } else {
                println!("Directory created successfully");
            }
        } else {
            println!("No '/' found in the input string.");
        }

        println!("Downloading file: {}", path.as_ref());

        let res = reqwest::get(url.as_ref())
            .await
            .with_context(|| format!("GET request failed: {}", url.as_ref()))?;

        if !res.status().is_success() {
            Err(format!(
                "GET Request: ({}): ({})",
                res.status(),
                url.as_ref()
            ))?
        }

        let content_length = res.content_length().unwrap_or(0);
        let mut bytes_downloaded = 0;
        let mut dest = tokio::fs::File::create(path.as_ref())
            .await
            .with_context(|| format!("Failed to create file at: {}", path.as_ref()))?;
        let mut stream = res.bytes_stream();

        let mut prev = 0;
        while let Some(chunk) = stream.next().await {
            use tokio::io::AsyncWriteExt;
            let chunk = chunk.unwrap();
            bytes_downloaded += chunk.len();
            dest.write_all(&chunk)
                .await
                .with_context(|| format!("Failed to write to destination {}", path.as_ref()))?;
            // progress for this task
            // print once every 10000 written bytes
            if (bytes_downloaded - prev) > 10000 {
                println!(
                    "{} - bytes downloaded: {}, out of: {}",
                    path.as_ref(),
                    bytes_downloaded,
                    content_length,
                );
                prev = bytes_downloaded;
            }
            if prev == bytes_downloaded || bytes_downloaded as u64 >= content_length {
                self.window
                    .emit(
                        "progress_bar_download_update",
                        ProgressPayload {
                            path: path.as_ref().to_string(),
                            service_id: self.service_id.clone(),
                            downloaded: bytes_downloaded as u64,
                            total: content_length,
                        },
                    )
                    .with_context(|| "Failed to emit event")?;
            }
        }

        // this is not immediate but ensures the file is locked
        _ = tokio::fs::remove_file(lockfile_path).await;

        Ok(())
    }
}
