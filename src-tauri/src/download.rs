use crate::{
    err,
    errors::{Result, ToResult},
    logerr, utils, SharedState,
};

use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
};

use futures::StreamExt;
use serde::Serialize;
use tauri::{Manager, Runtime, Window};
use tokio::{
    fs::{self, OpenOptions},
    io::AsyncWriteExt,
};

pub struct Downloader<R: Runtime> {
    binaries_url: HashMap<String, Option<String>>,
    weights_directory_url: String,
    weights_files: Vec<String>,
    service_id: String,
    app_data_dir: PathBuf,
    window: Window<R>,
}

#[derive(Clone, Serialize)]
struct ProgressPayload {
    path: String,
    #[serde(rename = "serviceId")]
    service_id: String,
    #[serde(rename = "downloadedFileSize")]
    downloaded_file_size: u64,
    #[serde(rename = "totalFileSize")]
    total_file_size: u64,
}

impl<R: Runtime> Downloader<R> {
    pub fn new(
        binaries_url: HashMap<String, Option<String>>,
        weights_directory_url: impl AsRef<str>,
        weights_files: Vec<String>,
        service_id: impl AsRef<str>,
        app_data_dir: impl AsRef<str>,
        window: Window<R>,
    ) -> Self {
        Self {
            binaries_url,
            weights_directory_url: weights_directory_url.as_ref().to_string(),
            weights_files,
            service_id: service_id.as_ref().to_string(),
            app_data_dir: PathBuf::from(app_data_dir.as_ref()),
            window,
        }
    }

    // TODO: write a proper download queue system, current implementation can be racy
    // shouldn't have a significant affect as long as all of our code is async and fast
    // but only a concern for slow running tasks(like download)
    pub async fn download_files(self) -> Result<()> {
        let binary_url =
            utils::get_binary_url(&self.binaries_url).msg("Failed to get the binary url")?;
        let binary_name = binary_url
            .split('/')
            .last()
            .msg("Invalid/Empty binary-url")?;
        let model_directory = self.app_data_dir.join("models").join(&self.service_id);
        let binary_path = model_directory.join(binary_name);

        let mut handlers = vec![];

        // calculate hashes
        let mut hashes: Vec<String> = vec![];
        let checksums_path = self.app_data_dir.join("checksums.json");
        // load hashes if present
        let downloaded_hashes =
            utils::read_checksum_json_with_key(&checksums_path, &self.service_id)
                .await
                .unwrap_or_default();

        for (url, output_path) in self
            .weights_files
            .iter()
            .map(|filename| {
                (
                    format!("{}{}", &self.weights_directory_url, filename),
                    model_directory.join(filename),
                )
            })
            .chain([(binary_url, binary_path.clone())])
        {
            if downloaded_hashes.contains(&url) {
                hashes.push(utils::hash_str(&url));
                continue;
            }

            let Ok((size_on_disk, total_file_size)) =
                self.get_size_on_disk(&output_path, &url).await
            else {
                continue;
            };
            if total_file_size == size_on_disk {
                log::warn!("File already downloaded: {}", output_path.display());
                // downloaded already, add to hashes
                // TODO: file_size is not a good file uniqueness marker consider removing
                hashes.push(utils::hash_str(&url));
            } else {
                // report the total_file_size
                let res = self.window.emit(
                    "progress_bar_download_update",
                    ProgressPayload {
                        path: output_path.display().to_string(),
                        service_id: self.service_id.clone(),
                        downloaded_file_size: 0,
                        total_file_size,
                    },
                );
                // just log err, don't halt download
                logerr!(res);
                handlers.push(self.download_file(url, output_path, total_file_size, size_on_disk));
            }
        }
        // start download
        let res = futures::future::join_all(handlers).await;
        self.set_execute_permission(&binary_path).await?;

        // update the hashes as per downloaded items list
        res.iter()
            .filter_map(|s| s.as_ref().ok())
            .for_each(|s| hashes.push(utils::hash_str(s)));

        // update checksums with list of stuff downloaded from here
        utils::write_checksum_json_with_key(
            &checksums_path,
            self.service_id,
            hashes.into_iter().map(|src| utils::hash_str(src)).collect(),
        )
        .await?;

        // push the errors to fn result
        res.into_iter().collect::<Result<Vec<String>>>().map(|_| ())
    }

    async fn get_size_on_disk(
        &self,
        output_path: impl AsRef<Path>,
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
                .with_msg(|| {
                    format!(
                        "get_size_on_disk Failed to get metadata for {}",
                        output_path.display()
                    )
                })?
                .len();
        }
        // Make Head request to get file size
        let res_head_request = reqwest::Client::new()
            .head(url)
            .send()
            .await
            .with_msg(|| format!("Failed to HEAD from {} to {}", url, output_path.display()))?;

        // If there is nothing else to download for this file, we can return.
        let total_file_size = res_head_request
            .headers()
            .get("content-length")
            .msg("Content-Length header key not provided")?
            .to_str()
            .msg("Content-Length not valid utf-8 value")?
            .parse()
            .msg("Content-Length not valid numeric value")?;

        Ok((size_on_disk, total_file_size))
    }

    async fn download_file(
        &self,
        url: impl AsRef<str>,
        output_path: PathBuf,
        total_file_size: u64,
        size_on_disk: u64,
    ) -> Result<String> {
        let state = self.window.state::<Arc<SharedState>>();
        let mut downloading_files_guard = state.downloading_files.lock().await;
        if downloading_files_guard.contains(&output_path) {
            log::warn!("File already downloading: {}", output_path.display());
            return Ok(url.as_ref().to_string());
        } else {
            downloading_files_guard.insert(output_path.clone());
        }
        drop(downloading_files_guard);

        // delete the file, if it already exists before download
        if output_path.exists() {
            if output_path.is_file() {
                std::fs::remove_file(&output_path)
                    .with_msg(|| format!("Failed to remove file at {}", output_path.display()))?;
            } else if output_path.is_dir() {
                std::fs::remove_dir_all(&output_path)
                    .with_msg(|| format!("Failed to remove dir at {}", output_path.display()))?;
            }
        }

        // Make GET request with range header
        log::info!("Downloading: {}", url.as_ref());
        log::info!("bytes={}-", size_on_disk);
        let res = reqwest::Client::new()
            .get(url.as_ref())
            .header(
                "Range",
                "bytes=".to_owned() + &size_on_disk.to_string()[..] + "-",
            )
            .send()
            .await
            .with_msg(|| {
                format!(
                    "Failed to GET from {} to {}",
                    url.as_ref(),
                    output_path.display()
                )
            })?;

        // Check the status for errors.
        if !res.status().is_success() {
            err!("GET Request: ({}): ({})", res.status(), url.as_ref());
        }

        // Prepare the destination directories
        if let Some(parent) = output_path.parent() {
            if let Err(e) = tokio::fs::create_dir_all(parent).await {
                log::error!("Error creating directory: {:?}", e);
            } else {
                log::info!("Directory created successfully or already exists");
            }
        } else {
            log::info!("No parent specified in path directory");
        }

        // Create the file.
        let mut file = OpenOptions::new()
            .create(true)
            .write(true)
            .append(true)
            .open(&output_path)
            .await
            .with_msg(|| format!("Failed to create file at: {}", output_path.display()))?;

        // Download the file chunk by chunk.
        let mut downloaded_file_size = size_on_disk;
        let mut stream = res.bytes_stream();
        let mut percent = 0;
        while let Some(item) = stream.next().await {
            // Retrieve chunk.
            let mut chunk = match item {
                Ok(chunk) => chunk,
                Err(e) => err!("Error while downloading: {e:?}"),
            };
            let chunk_size = chunk.len() as u64;

            downloaded_file_size += chunk_size;
            // Write the chunk to disk.
            file.write_all_buf(&mut chunk)
                .await
                .with_msg(|| format!("Failed to write to destination {}", output_path.display()))?;

            let p = downloaded_file_size * 100 / total_file_size;
            if p > percent {
                percent = p;
                // Emit progress to JS
                log::info!(
                    "downloaded {}%: ({}):  {} bytes / {} bytes",
                    percent,
                    output_path.display(),
                    downloaded_file_size,
                    total_file_size,
                );
                self.window
                    .emit(
                        "progress_bar_download_update",
                        ProgressPayload {
                            path: output_path.display().to_string(),
                            service_id: self.service_id.clone(),
                            downloaded_file_size,
                            total_file_size,
                        },
                    )
                    .msg("Failed to emit event")?;
            }
        }

        let mut downloading_files_guard = state.downloading_files.lock().await;
        downloading_files_guard.remove(&output_path);

        Ok(url.as_ref().to_string())
    }

    async fn set_execute_permission(&self, binary_path: impl AsRef<Path>) -> Result<()> {
        use std::os::unix::fs::PermissionsExt;
        let mut permissions = std::fs::metadata(binary_path.as_ref())
            .with_msg(|| {
                format!(
                    "Failed to get metadata for {}",
                    binary_path.as_ref().display()
                )
            })?
            .permissions();
        permissions.set_mode(0o755);
        // ensure the executable binaries are read-only so they can't be maliciously modified
        // post download even by self
        // note: delete doesn't depend on file perms, so overwriting will always work
        permissions.set_readonly(true);
        std::fs::set_permissions(binary_path.as_ref(), permissions).with_msg(|| {
            format!(
                "Failed to set permissions for {}",
                binary_path.as_ref().display()
            )
        })?;
        Ok(())
    }
}
