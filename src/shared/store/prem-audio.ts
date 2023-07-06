import storage from "shared/helpers/custom-storage";
import { PremAudioStore, PremAudioHistory } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const usePremAudioStore = create<PremAudioStore>()(
  persist(
    (set) => ({
      history: [],
      model: "whisper-1",
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
    }
  )
);

export default usePremAudioStore;
