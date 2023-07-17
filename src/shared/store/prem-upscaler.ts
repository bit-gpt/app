import storage from "shared/helpers/custom-storage";
import { PremUpscalerStore, PremUpscalerHistory } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const usePremUpscalerStore = create<PremUpscalerStore>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        addHistory: (newHistory: PremUpscalerHistory) =>
          set((state) => ({ history: [...state.history, newHistory] })),
        deleteHistory: (id: string) =>
          set((state) => ({
            history: state.history.filter((_history) => _history.id !== id),
          })),
      }),
      {
        name: "prem-upscaler",
        storage: createJSONStorage(() => storage),
      }
    ),
    { name: "store", store: "prem-upscaler" }
  )
);

export default usePremUpscalerStore;
