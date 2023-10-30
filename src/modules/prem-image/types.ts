import type { PremImageHistory } from "shared/types";

import type { Service } from "../service/types";

export type ImageGeneration = {
  prompt: string;
  n?: number;
  size?: string;
  response_format?: string;
  negative_prompt?: string;
  seed?: number;
};

export type UrlResponse = {
  url: string;
};

export type B64JsonResponse = {
  b64_json: string;
};

export type PremImageResponse = {
  onSubmit: () => void;
  prompt: string;
  setPrompt: (question: string) => void;
  isPending: boolean;
  isError: boolean;
  currentHistory: PremImageHistory | undefined;
  n: number;
  deleteHistory: (id: string) => void;
  negativePrompt: string;
  setNegativePrompt: (question: string) => void;
  file: File | undefined;
  setFile: (file: File | undefined) => void;
};

export type PremImageContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
  serviceType: Service["serviceType"];
};
