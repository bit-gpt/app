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

        // Download progress
        if (isDesktopEnv()) {
          type Payload = { downloaded: number; total: number; path: string; service_id: string };
          const files: Record<string, Payload> = {};
          await appWindow.listen(
            "progress_bar_download_update",
            ({ event, payload }: { event: any; payload: Payload }) => {
              files[payload.path] = payload;
              const totalDownloaded = Object.values(files).reduce(
                (acc, file) => acc + file.downloaded,
                0,
              );
              const totalTotal = Object.values(files).reduce((acc, file) => acc + file.total, 0);
              const progress = Math.floor((totalDownloaded / totalTotal) * 100);
              useSettingStore
                .getState()
                .setServiceDownloadProgress(payload.service_id, "binary", progress);
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
