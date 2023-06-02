import { getBackendUrl } from "shared/helpers/utils";
import { SettingStore } from "shared/types";
import { create } from "zustand";

const useSettingStore = create<SettingStore>()((set) => ({
  backendUrl: getBackendUrl(),
  setBackendUrl: (backendUrl) => set(() => ({ backendUrl })),
}));

export const getBackendUrlFromStore = () =>
  useSettingStore.getState().backendUrl;

export default useSettingStore;
