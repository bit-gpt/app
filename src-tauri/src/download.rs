use crate::errors::{Context, Result};

use futures::StreamExt;
use serde::Serialize;
use tauri::{Runtime, Window};
use tokio::fs::OpenOptions;
use tokio::io::AsyncWriteExt;

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
        let mut size_on_disk: u64 = 0;

        // Check if there is a file on disk already.
        if tokio::fs::metadata(path.as_ref()).await.is_ok() {
            // If so, check file length to know where to restart the download from.
            size_on_disk = tokio::fs::metadata(path.as_ref())
                .await
                .with_context(|| format!("Failed to get metadata for {}", path.as_ref()))?
                .len();
        }

        // Make GET request with range header
        let res = reqwest::Client::new()
            .get(url.as_ref())
            .header(
                "Range",
                "bytes=".to_owned() + &size_on_disk.to_string()[..] + "-",
            )
            .send()
            .await
            .map_err(|_| format!("Failed to GET from {} to {}", url.as_ref(), path.as_ref()))
            .unwrap();

        // Check the status for errors.
        if !res.status().is_success() {
            Err(format!(
                "GET Request: ({}): ({})",
                res.status(),
                url.as_ref()
            ))?
        }

        // If there is nothing else to download for this file, we can return.
        let total_file_size = res.content_length().unwrap_or_default() + size_on_disk;
        if total_file_size == size_on_disk {
            return Ok(());
        }

        // Prepare the destination directories
        if let Some(last_slash) = path.as_ref().rfind('/') {
            let dirs = &path.as_ref()[..last_slash];
            if let Err(e) = tokio::fs::create_dir_all(dirs).await {
                println!("Error creating directory: {:?}", e);
            } else {
                println!("Directory created successfully or already exists");
            }
        } else {
            println!("No '/' found in the input string.");
        }

        // Create the file.
        let mut file = OpenOptions::new()
            .create(true)
            .write(true)
            .append(true)
            .open(path.as_ref())
            .await
            .with_context(|| format!("Failed to create file at: {}", path.as_ref()))?;

        // Download the file chunk by chunk.
        let mut downloaded_size = size_on_disk;
        let mut stream = res.bytes_stream();
        while let Some(item) = stream.next().await {
            // Retrieve chunk.
            let mut chunk = match item {
                Ok(chunk) => chunk,
                Err(e) => {
                    return Err(format!("Error while downloading: {:?}", e))?;
                }
            };
            let chunk_size = chunk.len() as u64;

            downloaded_size += chunk_size;
            // Write the chunk to disk.
            file.write_all_buf(&mut chunk)
                .await
                .with_context(|| format!("Failed to write to destination {}", path.as_ref()))?;

            // Emit progress to JS
            println!(
                "{} - bytes downloaded: {}, out of: {}",
                path.as_ref(),
                downloaded_size,
                total_file_size,
            );
            self.window
                .emit(
                    "progress_bar_download_update",
                    ProgressPayload {
                        path: path.as_ref().to_string(),
                        service_id: self.service_id.clone(),
                        downloaded: downloaded_size,
                        total: total_file_size,
                    },
                )
                .with_context(|| "Failed to emit event")?;
        }
        Ok(())
    }
}
