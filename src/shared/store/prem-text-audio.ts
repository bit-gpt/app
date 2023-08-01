import storage from "shared/helpers/custom-storage";
import type { PremTextAudioHistory, PremTextAudioStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const usePremTextAudioStore = create<PremTextAudioStore>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        addHistory: (newHistory: PremTextAudioHistory) =>
          set((state) => ({ history: [...state.history, newHistory] })),
        deleteHistory: (id: string) =>
          set((state) => ({
            history: state.history.filter((_history) => _history.id !== id),
          })),
      }),
      {
        name: "prem-text-audio",
        storage: createJSONStorage(() => storage),
      },
    ),
    { name: "store", store: "prem-text-audio" },
  ),
);

export default usePremTextAudioStore;
