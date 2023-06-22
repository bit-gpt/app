import { PremImageHistory, PremImageStore } from "shared/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePremImageStore = create<PremImageStore>()(
  persist(
    (set) => ({
      history: [],
      n: 1,
      size: "512x512",
      response_format: "b64_json",
      addHistory: (newHistory: PremImageHistory) =>
        set((state) => ({ history: [...state.history, newHistory] })),
      deleteHistory: (id: string) =>
        set((state) => ({
          history: state.history.filter((_history) => _history.id !== id),
        })),
    }),
    {
      name: "prem-image",
    }
  )
);

export default usePremImageStore;
