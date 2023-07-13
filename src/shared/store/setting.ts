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
      setBackendUrl: (backendUrl) => set(() => ({ backendUrl })),
    }),
    {
      name: "setting",
      storage: createJSONStorage(() => storage),
    }
  ),
  {name: 'store', store: 'setting'}
  )
);

export const getBackendUrlFromStore = () => useSettingStore.getState().backendUrl;

export default useSettingStore;
