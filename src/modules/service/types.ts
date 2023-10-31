import type { PropsWithChildren } from "react";

export type ModelInfo = {
  inferenceTime?: string;
  maxLength?: number;
  memoryRequirements: number;
  tokenLimit?: number;
  weightsName?: string;
  weightsSize?: number;
  streaming?: boolean;
};

export type ServiceBase = {
  // static registry manifest
  baseUrl: string;
  beta: boolean;
  comingSoon: boolean;
  defaultExternalPort: number;
  defaultPort: number;
  description: string;
  documentation: string;
  icon: string;
  id: string;
  interfaces: string[];
  modelInfo: ModelInfo;
  name: string;
  needsUpdate: boolean;
  promptTemplate?: string;
  runningPort?: number;
  petals?: boolean;
  serviceType: "docker" | "binary" | "process";
  version?: string;
  // Dynamic state
  downloaded: boolean;
  enoughMemory: boolean;
  enoughSystemMemory: boolean;
  running: boolean;
  supported: boolean;
};

export type ServiceDocker = ServiceBase & {
  serviceType: "docker";
  dockerImage: string;
  dockerImageSize: number;
  volumeName?: string;
  volumePath?: string;
};

export type ServiceBinary = ServiceBase & {
  serviceType: "binary";
  serveCommand: string;
  modelFiles: string[];
  weightsDirectoryUrl: string;
  weightsFiles: string[];
  binariesUrl: {
    "aarch64-apple-darwin"?: string;
    "x86_64-apple-darwin"?: string;
    "universal-apple-darwin"?: string;
  };
};

export type Service = ServiceDocker | ServiceBinary;

export type SearchFilterProps = {
  apps: App[];
  onFilterChange: (e: Map<string, boolean>) => void;
};

export type Option = {
  label: string;
  value: string;
};

export type Stats = {
  cpu_percentage: number;
  memory_usage: number;
  memory_limit: number;
  memory_percentage: number;
  storage_usage: number;
  storage_limit: number;
  storage_percentage: number;
};

export type GPUStats = {
  gpu_name: string | null;
  total_memory: number | null;
  used_memory: number | null;
  memory_percentage: number | null;
};
export type Message = {
  message: string;
};

export type DownloadMessage = {
  status: string;
  percentage: number;
};

export type ServiceStateProps = {
  service: Service;
  refetch: () => void;
  progress?: number;
  isDetailView?: boolean;
  onOpenClick?: () => void;
};

export type ServiceStatus =
  | "docker_only"
  | "running"
  | "stopped"
  | "not_supported"
  | "not_downloaded"
  | "not_enough_memory"
  | "not_enough_system_memory"
  | "coming_soon";

export type ServiceCardProps = {
  className: string;
  service: Service;
};

export type ServiceActionsProps = PropsWithChildren<{
  status: ServiceStatus;
  service: Service;
  refetch: () => void;
  isDetailView?: boolean;
  interfaces: App[];
  needsUpdate: boolean;
  memoryRequirements: number;
  closeWarningModal?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isWarningModalOpen?: boolean;
}>;

export type WarningServiceStateProps = {
  status: ServiceStatus;
  memoryRequirements: number;
  isWarningModalOpen: boolean;
  closeWarningModal: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ServiceStats = {
  id: string;
  cpu_percentage: number;
  memory_usage: number;
  memory_limit: number;
  memory_percentage: number;
  storage_percentage: number;
  storage_usage: number;
  storage_limit: number;
};

export type DocumentationModalProps = {
  content: string;
  isOpen: boolean;
  closeModal: () => void;
};

export type App = {
  id: string;
  name: string;
  icon: string;
  playground: boolean;
  documentation: string;
};

export type CustomServiceModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};
