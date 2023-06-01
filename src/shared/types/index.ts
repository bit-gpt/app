import { Message, PremChatHistory } from "modules/prem-chat/types";

export type BotReplyProps = {
  reply: string;
};

export type DownloadDockerWallProps = {
  handleCheckIsDockerRunning: () => void;
  isDockerRunning: boolean;
};



export type SidebarProps = {
  toggleStatus: boolean;
  toggle: () => void;
};

export type SpinnerProps = {
  className?: string;
};

export type UserReplyProps = {
  reply: string;
};

export type DashboardIconPorps = {
  className: string;
};

export type ServiceIconPorps = {
  className: string;
};

export type PipelineIconProps = {
  className: string;
};

export type DocumentationIconProps = {
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
  target?: '_blank';
};

export type WarningModalProps = {
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOk: (e: React.MouseEvent<HTMLButtonElement>) => void;
  cancelButtonText?: string;
  okButtonText?: string;
  icon?: React.ReactNode;
  title?: string;
  description: string;
};


export type PremChatStore = {
  history: PremChatHistory[];
  clearHistory: () => void;
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
};

export type MarkdownProps = {
  children: string;
};
