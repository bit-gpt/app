import type { PremTextAudioHistory } from "shared/types";

import type { Service } from "../service/types";

export type AudioGenerationData = {
  prompt: string;
};

export type PremTextAudioContainerProps = {
  serviceName: string;
  historyId?: string;
  serviceId: string;
  serviceType: Service["serviceType"];
};

export type PremTextAudioHook = {
  currentHistory: PremTextAudioHistory | undefined;
  prompt: string;
  setPrompt: (prompt: string) => void;
  isPending: boolean;
  isError: boolean;
  onSubmit: () => void;
  deleteHistory: (id: string) => void;
};
