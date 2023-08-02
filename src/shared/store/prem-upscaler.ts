import storage from "shared/helpers/custom-storage";
import type { PremUpscalerStore, PremUpscalerHistory } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const usePremUpscalerStore = create<PremUpscalerStore>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        n: 1,
        response_format: "b64_json",
        prompt: "a high resolution image",
        guidance_scale: 7.5,
        num_inference_steps: 25,
        setPrompt: (prompt: string) => set(() => ({ prompt })),
        setGuidanceScale: (guidance_scale: number) => set(() => ({ guidance_scale })),
        setNumInferenceSteps: (num_inference_steps: number) => set(() => ({ num_inference_steps })),

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
      },
    ),
    { name: "store", store: "prem-upscaler" },
  ),
);

export default usePremUpscalerStore;
