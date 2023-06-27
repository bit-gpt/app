import { PremAudioHistory } from "shared/types";

export type TranscriptionsGeneration = {
  file: File;
  model: string;
};

export type PremAudioHook = {
  currentHistory: PremAudioHistory | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  isLoading: boolean;
  isError: boolean;
  onSubmit: () => void;
  deleteHistory: (id: string) => void;
};

export type PremAudioContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
};
