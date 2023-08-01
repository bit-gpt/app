import storage from "shared/helpers/custom-storage";
import type { PremImageHistory, PremImageStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const usePremImageStore = create<PremImageStore>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        n: 1,
        setN: (n: number) => set(() => ({ n })),
        size: "512x512",
        response_format: "b64_json",
        addHistory: (newHistory: PremImageHistory) =>
          set((state) => ({ history: [...state.history, newHistory] })),
        deleteHistory: (id: string) =>
          set((state) => ({
            history: state.history.filter((_history) => _history.id !== id),
          })),
        seed: 0,
        setSeed: (seed: number) => set(() => ({ seed })),
      }),
      {
        name: "prem-image",
        storage: createJSONStorage(() => storage),
      },
    ),
    { name: "store", store: "prem-image" },
  ),
);

export default usePremImageStore;
