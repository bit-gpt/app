import { appWindow } from "@tauri-apps/api/window";
import AppRouter from "AppRouter";
import Onboarding from "modules/onboarding/components/Onboarding";
import { useEffect } from "react";
import Modal from "react-modal";
import { isIP, isBrowserEnv, isDesktopEnv } from "shared/helpers/utils";

import useSettingStore, { getBackendUrl } from "./shared/store/setting";

Modal.setAppElement("#root");

function App() {
  const isBrowser = isBrowserEnv();
  const isSettingStoreHydrated = useSettingStore((state) => state._hasHydrated);

  useEffect(() => {
    (async () => {
      if (isSettingStoreHydrated) {
        const hostIsIP = isIP(window.location.host);
        // If not IP, then we assume it's a domain name
        useSettingStore.getState().setIsIP(hostIsIP);
        useSettingStore.getState().setBackendUrl(getBackendUrl());
        useSettingStore.getState().removeAllServiceAsDownloading();
        useSettingStore.getState().resetSwarm();

        // Download progress
        if (isDesktopEnv()) {
          type FilePayload = {
            downloadedFileSize: number;
            totalFileSize: number;
            path: string;
            serviceId: string;
          };
          // serviceId -> {filePath: FilePayload}
          const files: Record<string, Record<string, FilePayload>> = {};
          await appWindow.listen(
            "progress_bar_download_update",
            ({ event, payload }: { event: any; payload: FilePayload }) => {
              // save last file payload
              files[payload.serviceId] = { ...files[payload.serviceId], [payload.path]: payload };
              // calculate progress
              const downloadedFilesSize = Object.values(files[payload.serviceId]).reduce(
                (acc, file) => acc + file.downloadedFileSize,
                0,
              );
              const totalFilesSize = Object.values(files[payload.serviceId]).reduce(
                (acc, file) => acc + file.totalFileSize,
                0,
              );
              const progress = Math.floor((downloadedFilesSize / totalFilesSize) * 100);
              useSettingStore
                .getState()
                .setServiceDownloadProgress(payload.serviceId, "binary", progress);
            },
          );
        }
      }
    })();
  }, [isSettingStoreHydrated]);

  if (!isBrowser) {
    return <Onboarding redirectTo={<AppRouter />} />;
  }

  return <AppRouter />;
}

export default App;
