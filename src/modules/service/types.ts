import { App } from "modules/dashboard/types";

export type CheckeBoxProps = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type DropdownProps = {
  open: boolean;
  close: () => void;
  apps: App[];
  onFilterChange: (e: Map<string, boolean>) => void;
  appId: string;
};

type ModelInfo = {
  devices: string[];
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
