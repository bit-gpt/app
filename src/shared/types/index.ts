import type { Message, PremChatHistory } from "modules/prem-chat/types";

import type { Service } from "../../modules/service/types";

export type BotReplyProps = {
  reply: string;
};

export type SpinnerProps = {
  className?: string;
};

export type UserReplyProps = {
  reply: string;
};

export type ServiceIconPorps = {
  className: string;
};

export type PipelineIconProps = {
  className: string;
};

export type SettingIconProps = {
  className: string;
};

export type CloseIconProps = {
  className: string;
};

export type NavLinkItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  target?: "_blank";
  newFeature?: boolean;
};

export enum Swarm {
  Inactive = "inactive",
  Creating = "creating",
  Active = "active",
}

export enum EnvironmentDeletion {
  Idle = "idle",
  Progress = "progress",
  Completed = "completed",
}

export type SwarmInfo = {
  model: string;
  publicName: string;
  numBlocks: number;
};

export type WarningModalProps = {
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOk: (e: React.MouseEvent<HTMLButtonElement>) => void;
  cancelButtonText?: string;
  okButtonText?: string;
  icon?: React.ReactNode;
  title?: string;
  description: string;
  isOpen: boolean;
};

export type ModalProps = {
  onOk: (e: React.MouseEvent<HTMLButtonElement>) => void;
  okButtonText?: string;
  icon?: React.ReactNode;
  title?: string;
  description: React.ReactNode;
  isOpen: boolean;
};

export type PremChatStore = {
  history: PremChatHistory[];
  clearHistory: (serviceId: string) => void;
  addHistory: (newHistory: PremChatHistory) => void;
  updateHistoryMessages: (id: string, messages: Message[]) => void;
  deleteHistory: (id: string) => void;
  temperature: number;
  setTemperature: (temperature: number) => void;
  max_tokens: number;
  setMaxTokens: (max_tokens: number) => void;
  top_p: number;
  setTopP: (top_p: number) => void;
  frequency_penalty: number;
  setFrequencyPenalty: (frequency_penalty: number) => void;
  n: number;
  setN: (n: number) => void;
  presence_penalty: number;
  setPresencePenalty: (presence_penalty: number) => void;
  promptTemplate: string;
  setPromptTemplate: (promptTemplate: string) => void;
  setChatServiceUrl: (chatServiceUrl: string) => void;
  chatServiceUrl: string;
};

export type MarkdownProps = {
  children: string;
};

export type SettingStore = {
  _hasHydrated: boolean;
  backendUrl: string;
  setBackendUrl: (backendUrl: string) => void;
  isIP: boolean;
  setIsIP: (isIP: boolean) => void;
  serviceDownloadsInProgress: Record<string, Record<string, any>>;
  setServiceDownloadProgress: (serviceId: string, serviceType: string, progress: number) => void;
  removeServiceDownloadInProgress: (serviceId: string) => void;
  downloadingServices: string[];
  addServiceAsDownloading: (serviceId: string) => void;
  removeServiceAsDownloading: (serviceId: string) => void;
  removeAllServiceAsDownloading: () => void;
  newFeature: boolean;
  setNewFeature: (newFeature: boolean) => void;
  swarmMode: Swarm;
  setSwarmMode: (mode: Swarm) => void;
  swarmInfo: SwarmInfo | null;
  setSwarmInfo: (swarmInfo: SwarmInfo | null) => void;
  environmentDeletion: EnvironmentDeletion | null;
  setEnvironmentDeletion: (environmentDeletion: EnvironmentDeletion) => void;
  resetSwarm: () => void;
};

export type HeaderProps = {
  setRightSidebar: (value: boolean) => void;
  rightSidebar: boolean;
  hamburgerMenuOpen: boolean;
  setHamburgerMenu: (value: boolean) => void;
  title: string;
  isPetals?: boolean;
};

export type HamburgerMenuProps = {
  hamburgerMenuOpen: boolean;
  setHamburgerMenu: (value: boolean) => void;
  serviceId: string;
  serviceType: Service["serviceType"];
  historyId: string;
};

export interface RightSidebarProps {
  isLoading?: boolean;
  setRightSidebar: (value: boolean) => void;
}

export type PremImageSize = "256x256" | "512x512" | "1024x1024";

export type PremImageStore = {
  history: PremImageHistory[];
  n: number;
  size: PremImageSize;
  response_format: string;
  addHistory: (newHistory: PremImageHistory) => void;
  deleteHistory: (id: string) => void;
  setN: (n: number) => void;
  seed: number;
  setSeed: (seed: number) => void;
};

export type PremImageHistory = {
  id: string;
  prompt: string;
  images: string[];
  timestamp: string;
};

export type PremAudioStore = {
  history: PremAudioHistory[];
  addHistory: (newHistory: PremAudioHistory) => void;
  deleteHistory: (id: string) => void;
};

export type PremAudioHistory = {
  id: string;
  file: string;
  model: string;
  transcriptions: string;
  timestamp: string;
};

export type PremTextAudioHistory = {
  id: string;
  file: string;
  prompt: string;
  timestamp: string;
  fileUrl: string;
};

export type PremTextAudioStore = {
  history: PremTextAudioHistory[];
  addHistory: (newHistory: PremTextAudioHistory) => void;
  deleteHistory: (id: string) => void;
};

export type PremUpscalerStore = {
  history: PremUpscalerHistory[];
  n: number;
  response_format: string;
  prompt: string;
  guidance_scale: number;
  num_inference_steps: number;

  addHistory: (newHistory: PremUpscalerHistory) => void;
  deleteHistory: (id: string) => void;

  setPrompt: (prompt: string) => void;
  setGuidanceScale: (guidance_scale: number) => void;
  setNumInferenceSteps: (num_inference_steps: number) => void;
};

export type PremUpscalerHistory = {
  id: string;
  file: string;
  name: string;
  timestamp: string;
};
