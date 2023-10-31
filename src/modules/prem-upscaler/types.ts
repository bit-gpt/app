import type { PremUpscalerHistory } from "shared/types";

import type { Service } from "../service/types";

export type ImageGeneration = {
  image: File;
  prompt: string;
  n: number;
  response_format: string;
  guidance_scale: number;
  num_inference_steps: number;
};

export type PremUpscalerHook = {
  currentHistory: PremUpscalerHistory | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  isPending: boolean;
  isError: boolean;
  onSubmit: () => void;
  deleteHistory: (id: string) => void;
};

export type PremUpscalerContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
  serviceType: Service["serviceType"];
};
