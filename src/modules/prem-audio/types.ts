import { PremAudioHistory } from "shared/types";
import { StatusMessages } from "react-media-recorder";

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

export type AudioRecorderProps = {
  error: string;
  startRecording: () => void;
  pauseRecording: () => void;
  stopRecording: () => void;
  resumeRecording: () => void;
  status: StatusMessages;
};
