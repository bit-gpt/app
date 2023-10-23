use crate::errors::{Context, Result};
use std::collections::HashMap;

use crate::utils;
use futures::StreamExt;
use serde::Serialize;
use tauri::{Runtime, Window};
use tokio::fs;
use tokio::fs::OpenOptions;
use tokio::io::AsyncWriteExt;

pub struct Downloader<R: Runtime> {
    binaries_url: HashMap<String, Option<String>>,
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
        binaries_url: HashMap<String, Option<String>>,
        weights_directory_url: impl AsRef<str>,
        weights_files: Vec<String>,
        service_id: impl AsRef<str>,
        service_dir: impl AsRef<str>,
        window: Window<R>,
    ) -> Self {
        Self {
            binaries_url,
            weights_directory_url: weights_directory_url.as_ref().to_string(),
            weights_files: weights_files.to_vec(),
            service_id: service_id.as_ref().to_string(),
            service_dir: service_dir.as_ref().to_string(),
            window,
        }
    }

    pub async fn download_files(&self) -> Result<()> {
        let binary_url = utils::get_binary_url(&self.binaries_url).unwrap();
        let binary_name = binary_url.split('/').last().unwrap();
        let binary_path = format!("{}/{}", self.service_dir, binary_name);
        let mut handlers = vec![];
        for filename in self
            .weights_files
            .iter()
            .chain(std::iter::once(&binary_path))
        {
            let url = format!("{}{}", &self.weights_directory_url, filename);
            let output_path = format!("{}/{}", &self.service_dir, filename);
            let Ok((size_on_disk, total_file_size)) =
                self.get_size_on_disk(&output_path, &url).await
            else {
                continue;
            };
            if total_file_size == size_on_disk {
                println!("File already downloaded: {}", output_path);
            } else {
                // report the total_file_size
                self.window
                    .emit(
                        "progress_bar_download_update",
                        ProgressPayload {
                            path: output_path.clone(),
                            service_id: self.service_id.clone(),
                            downloaded: 0,
                            total: total_file_size,
                        },
                    )
                    .with_context(|| "Failed to emit event")?;
                handlers.push(self.download_file(url, output_path, total_file_size, size_on_disk))
            }
        }
        let res = futures::future::join_all(handlers).await;
        self.set_execute_permission(&binary_path).await?;
        res.into_iter().collect()
    }

    async fn get_size_on_disk(
        &self,
        output_path: impl AsRef<str>,
        url: impl AsRef<str>,
    ) -> Result<(u64, u64)> {
        let output_path = output_path.as_ref();
        let url = url.as_ref();
        let mut size_on_disk: u64 = 0;
        // Check if there is a file on disk already.
        if fs::metadata(output_path).await.is_ok() {
            // If so, check file length to know where to restart the download from.
            size_on_disk = fs::metadata(output_path)
                .await
                .with_context(|| format!("Failed to get metadata for {}", output_path))?
                .len();
        }
        // Make Head request to get file size
        let res_head_request = reqwest::Client::new()
            .head(url)
            .send()
            .await
            .with_context(|| format!("Failed to HEAD from {} to {}", url, output_path))?;

        // If there is nothing else to download for this file, we can return.
        let total_file_size = res_head_request
            .headers()
            .get("content-length")
            .with_context(|| "Content-Length header key not provided.")?
            .to_str()
            .with_context(|| "Content-Length not valid utf-8 value")?
            .parse()
            .with_context(|| "Content-Length not valid numeric value")?;

        Ok((size_on_disk, total_file_size))
    }

    async fn download_file(
        &self,
        url: impl AsRef<str>,
        output_path: impl AsRef<str>,
        total_file_size: u64,
        size_on_disk: u64,
    ) -> Result<()> {
        // Make GET request with range header
        println!("Downloading: {}", url.as_ref());
        println!("bytes={}-", size_on_disk);
        let res = reqwest::Client::new()
            .get(url.as_ref())
            .header(
                "Range",
                "bytes=".to_owned() + &size_on_disk.to_string()[..] + "-",
            )
            .send()
            .await
            .with_context(|| {
                format!(
                    "Failed to GET from {} to {}",
                    url.as_ref(),
                    output_path.as_ref()
                )
            })?;

        // Check the status for errors.
        if !res.status().is_success() {
            Err(format!(
                "GET Request: ({}): ({})",
                res.status(),
                url.as_ref()
            ))?
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
        let mut percent = 0;
        while let Some(item) = stream.next().await {
            // Retrieve chunk.
            let mut chunk = match item {
                Ok(chunk) => chunk,
                Err(e) => Err(format!("Error while downloading: {:?}", e))?,
            };
            let chunk_size = chunk.len() as u64;

            downloaded_size += chunk_size;
            // Write the chunk to disk.
            file.write_all_buf(&mut chunk).await.with_context(|| {
                format!("Failed to write to destination {}", output_path.as_ref())
            })?;

            let p = downloaded_size * 100 / total_file_size;
            if p > percent {
                percent = p;
                // Emit progress to JS
                println!(
                    "downloaded {}%: ({}):  {} bytes / {} bytes",
                    percent,
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
        }
        Ok(())
    }

    async fn set_execute_permission(&self, binary_path: impl AsRef<str>) -> Result<()> {
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
