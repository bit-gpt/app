import { App } from "modules/dashboard/types";
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
  memoryRequirements: string;
  tokenLimit: number;
  weightsName: string;
  weightsSize: number;
};

export type Service = {
  apps: string[];
  defaultPort: number;
  description: string;
  dockerImage: string;
  documentation: string;
  downloaded: boolean;
  icon: string;
  id: string;
  modelInfo: ModelInfo;
  name: string;
  running: boolean;
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
  storage_usage: number;
  storage_limit: number;
  storage_percentage: number;
};

export type Message = {
  message: string;
};

export type ServiceStateProps = {
  serviceId: string;
  refetch: () => void;
};

export type ServiceStatus =
  | "running"
  | "stopped"
  | "not_downloaded"
  | "downloading"
  | "available_memory_less_than_container"
  | "system_memory_less_than_container";

export type ServiceCardProps = {
  title: string;
  className: string;
  icon: string;
  status: ServiceStatus;
  serviceId: string;
};

export type ServiceActionsProps = PropsWithChildren<{
  status: ServiceStatus;
  serviceId: string;
  refetch: () => void;
}>;
