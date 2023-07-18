import storage from "shared/helpers/custom-storage";
import { getBackendUrl } from "shared/helpers/utils";
import { SettingStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const useSettingStore = create<SettingStore>()(
  devtools(
    persist(
      (set) => ({
        backendUrl: getBackendUrl(),
        serviceDownloadsInProgress: [],
        addServiceDownloadInProgress: (serviceId) => {
          set(
            (state) => {
              if (!state.serviceDownloadsInProgress.includes(serviceId)) {
                state.serviceDownloadsInProgress.push(serviceId);
              }
              return { serviceDownloadsInProgress: state.serviceDownloadsInProgress };
            },
            false,
            "addServiceDownloadInProgress"
          );
        },
        removeServiceDownloadInProgress: (serviceId) => {
          set((state) => {
            const index = state.serviceDownloadsInProgress.indexOf(serviceId);
            if (index > -1) {
              state.serviceDownloadsInProgress.splice(index, 1);
            }
            return { serviceDownloadsInProgress: state.serviceDownloadsInProgress };
          });
        },
        setBackendUrl: (backendUrl) => set(() => ({ backendUrl }), false, "setBackendUrl"),
      }),
      {
        name: "setting",
        storage: createJSONStorage(() => storage),
      }
    ),
    { name: "store", store: "setting" }
  )
);

export const getBackendUrlFromStore = () => useSettingStore.getState().backendUrl;

export default useSettingStore;
