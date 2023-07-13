import storage from "shared/helpers/custom-storage";
import { PremTextAudioHistory, PremTextAudioStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const usePremTextAudioStore = create<PremTextAudioStore>()(
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
    }
  )
);

export default usePremTextAudioStore;
