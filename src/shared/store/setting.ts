import storage from "shared/helpers/custom-storage";
import { getBackendUrl } from "shared/helpers/utils";
import { SettingStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      backendUrl: getBackendUrl(),
      setBackendUrl: (backendUrl) => set(() => ({ backendUrl })),
    }),
    {
      name: "setting",
      storage: createJSONStorage(() => storage)
    }
  )
);

export const getBackendUrlFromStore = () => useSettingStore.getState().backendUrl;

export default useSettingStore;
