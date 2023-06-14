import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PremMichelangeloStore = {
  n: number;
  setN: (n: number) => void;
  size: string;
  setSize: (size: string) => void;
  response_format: string;
  setResponseFormat: (response_format: string) => void;
};

const usePremMichelangeloStore = create<PremMichelangeloStore>()(
  persist(
    (set) => ({
      n: 1,
      setN: (n) => set(() => ({ n })),
      size: "256x256",
      setSize: (size) => set(() => ({ size })),
      response_format: "url",
      setResponseFormat: (response_format) => set(() => ({ response_format })),
    }),
    {
      name: "prem-michelangelo",
    }
  )
);

export default usePremMichelangeloStore;
