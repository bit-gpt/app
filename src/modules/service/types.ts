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
  baseUrl: string;
  beta: boolean;
  comingSoon: boolean;
  defaultPort: number;
  description: string;
  documentation: string;
  downloaded: boolean;
  enoughMemory: boolean;
  enoughSystemMemory: boolean;
  icon: string;
  id: string;
  interfaces: string[];
  modelInfo: ModelInfo;
  name: string;
  needsUpdate: boolean;
  promptTemplate?: string;
  running: boolean;
  runningPort?: number;
  supported: boolean;
  serviceType: "docker" | "binary" | "process";
  version?: string;
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
  weightsUrl: string;
  serveCommand: string;
  huggingFaceId: string;
  modelFiles: string[];
};

export type ServiceProcess = ServiceBase & {
  serviceType: "process";
};

export type Service = ServiceDocker | ServiceBinary | ServiceProcess;

export type SearchFilterProps = {
  apps: App[];
  onFilterChange: (e: Map<string, boolean>) => void;
  appId: string;
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
  | "running"
  | "stopped"
  | "not_supported"
  | "not_downloaded"
  | "not_enough_memory"
  | "not_enough_system_memory"
  | "coming_soon";

export type ServiceCardProps = {
  className: string;
  icon: string;
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
}>;

export type WarningServiceStateProps = {
  status: ServiceStatus;
  memoryRequirements: number;
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
