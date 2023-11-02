import storage from "shared/helpers/custom-storage";
import { isIP, isPackaged, isProxyEnabled } from "shared/helpers/utils";
import type { SettingStore, SwarmInfo } from "shared/types";
import { EnvironmentDeletion, Swarm } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const getBackendUrl = () => {
  let backendURL = "http://localhost:54321/";
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
  if (isProxyEnabled() && !isIP(window.location.host)) {
    const arr = backendURL.split("://");
    backendURL = arr[0] + "://premd." + arr[1];
  }
  return backendURL;
};

const useSettingStore = create<SettingStore>()(
  devtools(
    persist(
      (set) => ({
        _hasHydrated: false,
        backendUrl: "",
        isIP: false,
        setIsIP: (isIP) => set(() => ({ isIP }), false, "setIsIP"),
        serviceDownloadsInProgress: {},
        downloadingServices: [],
        setBackendUrl: (backendUrl) => set(() => ({ backendUrl }), false, "setBackendUrl"),
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
        setServiceDownloadProgress: (serviceId: string, serviceType: string, progress: number) => {
          set(
            (state) => ({
              serviceDownloadsInProgress: {
                ...state.serviceDownloadsInProgress,
                [serviceId]: { progress, serviceType },
              },
            }),
            false,
            "setServiceDownloadProgress",
          );
        },
        addServiceAsDownloading: (serviceId: string) => {
          set(
            (state) => ({
              downloadingServices: [...state.downloadingServices, serviceId],
            }),
            false,
            "addServiceAsDownloading",
          );
        },
        removeServiceAsDownloading: (serviceId: string) => {
          set(
            (state) => ({
              downloadingServices: state.downloadingServices.filter((id) => id !== serviceId),
            }),
            false,
            "removeServiceAsDownloading",
          );
        },
        removeAllServiceAsDownloading: () => {
          set(
            () => ({
              downloadingServices: [],
            }),
            false,
            "removeAllServiceAsDownloading",
          );
        },
        newFeature: true,
        setNewFeature: (newFeature: boolean) => set(() => ({ newFeature }), false, "setNewFeature"),
        swarmMode: Swarm.Inactive,
        setSwarmMode: (swarmMode: Swarm) => set(() => ({ swarmMode }), false, "setSwarmMode"),
        swarmInfo: null,
        setSwarmInfo: (swarmInfo: SwarmInfo | null) =>
          set(() => ({ swarmInfo }), false, "setSwarmInfo"),
        environmentDeletion: EnvironmentDeletion.Completed,
        setEnvironmentDeletion: (environmentDeletion: EnvironmentDeletion) =>
          set(() => ({ environmentDeletion }), false, "setEnvironmentDeletion"),
        resetSwarm: () => {
          set(
            () => ({
              swarmInfo: null,
              swarmMode: Swarm.Inactive,
            }),
            false,
            "resetSwarm",
          );
        },
      }),
      {
        name: "setting",
        storage: createJSONStorage(() => storage),
        onRehydrateStorage: () => () => {
          useSettingStore.setState({ _hasHydrated: true });
        },
      },
    ),
    { name: "store", store: "setting" },
  ),
);

export default useSettingStore;
