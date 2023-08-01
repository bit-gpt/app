import type { PremTextAudioHistory } from "shared/types";

export type AudioGenerationData = {
  prompt: string;
};

export type PremTextAudioContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
};

export type PremTextAudioHook = {
  currentHistory: PremTextAudioHistory | undefined;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  isError: boolean;
  onSubmit: () => void;
  deleteHistory: (id: string) => void;
};
