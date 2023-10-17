use crate::errors::{Context, Result};

use futures::StreamExt;
use serde::Serialize;
use tauri::{Runtime, Window};
use tokio::fs::{File, OpenOptions};
use tokio::io::AsyncWriteExt;

pub struct Downloader<R: Runtime> {
    binary_url: String,
    weights_directory_url: String,
    weights_files: Vec<String>,
    service_id: String,
    service_dir: String,
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
        binary_url: impl AsRef<str>,
        weights_directory_url: impl AsRef<str>,
        weights_files: Vec<String>,
        service_id: impl AsRef<str>,
        service_dir: impl AsRef<str>,
        window: Window<R>,
    ) -> Self {
        Self {
            binary_url: binary_url.as_ref().to_string(),
            weights_directory_url: weights_directory_url.as_ref().to_string(),
            weights_files: weights_files.to_vec(),
            service_id: service_id.as_ref().to_string(),
            service_dir: service_dir.as_ref().to_string(),
            window,
        }
    }

    pub async fn download_files(&self) -> Result<()> {
        self.download_binary().await?;
        self.download_weights_files().await
    }

    async fn download_weights_files(&self) -> Result<()> {
        futures::future::join_all(self.weights_files.clone().into_iter().map(|filename| {
            let url = format!("{}{}", &self.weights_directory_url, filename);
            self.download_weight_file(url, format!("{}/{}", &self.service_dir, filename))
        }))
        .await
        .into_iter()
        .collect()
    }

    async fn download_weight_file(
        &self,
        url: impl AsRef<str>,
        output_path: impl AsRef<str>,
    ) -> Result<()> {
        let mut size_on_disk: u64 = 0;

        // Check if there is a file on disk already.
        if tokio::fs::metadata(output_path.as_ref()).await.is_ok() {
            // If so, check file length to know where to restart the download from.
            size_on_disk = tokio::fs::metadata(output_path.as_ref())
                .await
                .with_context(|| format!("Failed to get metadata for {}", output_path.as_ref()))?
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
            .map_err(|_| {
                format!(
                    "Failed to GET from {} to {}",
                    url.as_ref(),
                    output_path.as_ref()
                )
            })
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
        if let Some(last_slash) = output_path.as_ref().rfind('/') {
            let dirs = &output_path.as_ref()[..last_slash];
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
            .open(output_path.as_ref())
            .await
            .with_context(|| format!("Failed to create file at: {}", output_path.as_ref()))?;

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
            file.write_all_buf(&mut chunk).await.with_context(|| {
                format!("Failed to write to destination {}", output_path.as_ref())
            })?;

            // Emit progress to JS
            println!(
                "{} - bytes downloaded: {}, out of: {}",
                output_path.as_ref(),
                downloaded_size,
                total_file_size,
            );
            self.window
                .emit(
                    "progress_bar_download_update",
                    ProgressPayload {
                        path: output_path.as_ref().to_string(),
                        service_id: self.service_id.clone(),
                        downloaded: downloaded_size,
                        total: total_file_size,
                    },
                )
                .with_context(|| "Failed to emit event")?;
        }
        Ok(())
    }

    pub async fn download_binary(&self) -> Result<()> {
        let response = reqwest::get(&self.binary_url)
            .await
            .expect("Failed to download binary");

        let binary_name = self.binary_url.split('/').last().unwrap();
        let output_path = format!("{}/{}", self.service_dir, binary_name);

        // Prepare the destination directories
        if let Some(last_slash) = output_path.rfind('/') {
            let dirs = &output_path[..last_slash];
            if let Err(e) = tokio::fs::create_dir_all(dirs).await {
                println!("Error creating directory: {:?}", e);
            } else {
                println!("Directory created successfully or already exists");
            }
        } else {
            println!("No '/' found in the input string.");
        }

        if !response.status().is_success() {
            Err(format!(
                "GET Request: ({}): ({})",
                response.status(),
                self.binary_url
            ))?
        }

        let mut file = File::create(&output_path.as_str()).await.unwrap();
        file.write(&response.bytes().await.unwrap())
            .await
            .with_context(|| format!("Failed to write to {}", output_path))?;
        self.set_permission(output_path).await?;
        Ok(())
    }

    async fn set_permission(&self, binary_path: impl AsRef<str>) -> Result<()> {
        use std::os::unix::fs::PermissionsExt;
        let mut permissions = std::fs::metadata(binary_path.as_ref())
            .with_context(|| format!("Failed to get metadata for {}", binary_path.as_ref()))?
            .permissions();
        permissions.set_mode(0o755);
        std::fs::set_permissions(binary_path.as_ref(), permissions)
            .with_context(|| format!("Failed to set permissions for {}", binary_path.as_ref()))?;
        Ok(())
    }
}
