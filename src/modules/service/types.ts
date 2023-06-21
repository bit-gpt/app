import { PropsWithChildren } from "react";

export type CheckeBoxProps = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type DropdownProps = {
  open: boolean;
  close: () => void;
  apps: App[];
  search: Map<string, boolean>;
  onChange: (appId: string, status: boolean) => void;
};

export type ModelInfo = {
  inferenceTime: string;
  maxLength: number;
  memoryRequirements: number;
  tokenLimit: number;
  weightsName: string;
  weightsSize: number;
  streaming: boolean;
};

export type Service = {
  defaultPort: number;
  description: string;
  dockerImage: string;
  dockerImageSize: number;
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
  running: boolean;
  runningPort: number;
  supported: boolean;
  volumeName: string | null;
  volumePath: string | null;
  beta: boolean;
  comingSoon: boolean;
};

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
  serviceId: string;
  refetch: () => void;
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
  serviceId: string;
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
