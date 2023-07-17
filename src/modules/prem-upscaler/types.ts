import { PremUpscalerHistory } from "shared/types";

export type ImageGeneration = {
  file: File;
};

export type PremUpscalerHook = {
  currentHistory: PremUpscalerHistory | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  isLoading: boolean;
  isError: boolean;
  onSubmit: () => void;
  deleteHistory: (id: string) => void;
};

export type PremUpscalerContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
};
