import type { PremAudioHistory } from "shared/types";

import type { Service } from "../service/types";

export type TranscriptionsGeneration = {
  file: File;
  model: string;
};

export type PremAudioHook = {
  currentHistory: PremAudioHistory | undefined;
  file: File | null;
  setFile: (file: File | null) => void;
  isPending: boolean;
  isError: boolean;
  onSubmit: () => void;
  deleteHistory: (id: string) => void;
};

export type PremAudioContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
  serviceType: Service["serviceType"];
};

export type PremAudioRecordTabsProps = {
  file: File | null;
  setFile: (file: File | null) => void;
};
