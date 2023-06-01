import {  getBackendUrl } from "shared/helpers/utils";
import { SettingStore } from "shared/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      backendUrl: getBackendUrl(),
      setBackendUrl: (backendUrl) => set(() => ({ backendUrl })),
    }),
    {
      name: "setting",
    }
  )
);

export const BACKEND_URL = () => useSettingStore.getState().backendUrl;

export default useSettingStore;
