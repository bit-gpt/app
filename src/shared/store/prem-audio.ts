import storage from "shared/helpers/custom-storage";
import type { PremAudioStore, PremAudioHistory } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const usePremAudioStore = create<PremAudioStore>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        addHistory: (newHistory: PremAudioHistory) =>
          set((state) => ({ history: [...state.history, newHistory] })),
        deleteHistory: (id: string) =>
          set((state) => ({
            history: state.history.filter((_history) => _history.id !== id),
          })),
      }),
      {
        name: "prem-audio",
        storage: createJSONStorage(() => storage),
      },
    ),
    { name: "store", store: "prem-audio" },
  ),
);

export default usePremAudioStore;
