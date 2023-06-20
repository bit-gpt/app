import { PremImageHistory, PremImageStore } from "shared/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePremImageStore = create<PremImageStore>()(
  persist(
    (set) => ({
      history: [],
      n: 1,
      setN: (n) => set(() => ({ n })),
      size: "256x256",
      setSize: (size) => set(() => ({ size })),
      response_format: "url",
      setResponseFormat: (response_format) => set(() => ({ response_format })),
      addHistory: (newHistory: PremImageHistory) =>
        set((state) => ({ history: [...state.history, newHistory] })),
    }),
    {
      name: "prem-michelangelo",
    }
  )
);

export default usePremImageStore;
