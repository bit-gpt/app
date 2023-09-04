import storage from "shared/helpers/custom-storage";
import { isIP, isPackaged, isProxyEnabled } from "shared/helpers/utils";
import type { SettingStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const getBackendUrl = () => {
  let backendURL = "http://localhost:54321";
  const isBackendSet = () => {
    return (
      ((window as any).VITE_BACKEND_URL !== undefined || import.meta.env.VITE_BACKEND_URL) &&
      ((window as any).VITE_BACKEND_URL !== "" || import.meta.env.VITE_BACKEND_URL !== "")
    );
  };
  if (isBackendSet()) {
    backendURL = (window as any).VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL;
  }
  if (isPackaged()) {
    backendURL = `${window.location.protocol}//${window.location.host}/`;
  }
  if (isProxyEnabled() && !isIP(backendURL)) {
    const arr = backendURL.split("://");
    backendURL = arr[0] + "://premd." + arr[1];
  }
  return backendURL;
};

const useSettingStore = create<SettingStore>()(
  devtools(
    persist(
      (set) => ({
        backendUrl: getBackendUrl(),
        isIP: false,
        setIsIP: (isIP) => set(() => ({ isIP }), false, "setIsIP"),
        serviceDownloadsInProgress: {},
        setBackendUrl: (backendUrl) => set(() => ({ backendUrl }), false, "setBackendUrl"),
        addServiceDownloadInProgress: (serviceId: string) => {
          set(
            (state) => ({
              serviceDownloadsInProgress: { ...state.serviceDownloadsInProgress, [serviceId]: 0 },
            }),
            false,
            "addServiceDownloadInProgress",
          );
        },
        removeServiceDownloadInProgress: (serviceId: string) => {
          set(
            (state) => {
              delete state.serviceDownloadsInProgress[serviceId];
              return { serviceDownloadsInProgress: state.serviceDownloadsInProgress };
            },
            false,
            "removeServiceDownloadInProgress",
          );
        },
        setServiceDownloadProgress: (serviceId: string, percentage: number) => {
          set(
            (state) => ({
              serviceDownloadsInProgress: {
                ...state.serviceDownloadsInProgress,
                [serviceId]: percentage,
              },
            }),
            false,
            "setServiceDownloadProgress",
          );
        },
      }),
      {
        name: "setting",
        storage: createJSONStorage(() => storage),
      },
    ),
    { name: "store", store: "setting" },
  ),
);

export default useSettingStore;
