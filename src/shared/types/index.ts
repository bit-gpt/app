import { Message, PremChatHistory } from "modules/prem-chat/types";

export type BotReplyProps = {
  reply: string;
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

export type SettingStore = {
  backendUrl: string;
  setBackendUrl: (backendUrl: string) => void;
};

export type HeaderProps = {
  setRightSidebar: (value: boolean) => void;
  rightSidebar: boolean;
  hamburgerMenuOpen: boolean;
  setHamburgerMenu: (value: boolean) => void;
  title: string;
};

export type HamburgerMenuProps = {
  setHamburgerMenu: (value: boolean) => void;
};

export type RightSidebarProps = {
  setRightSidebar: (value: boolean) => void;
};

export type PremImageSize = "256x256" | "512x512" | "1024x1024";

export type PremImageStore = {
  history: PremImageHistory[];
  n: number;
  setN: (n: number) => void;
  size: PremImageSize;
  setSize: (size: PremImageSize) => void;
  response_format: string;
  setResponseFormat: (response_format: string) => void;
  addHistory: (newHistory: PremImageHistory) => void;
};

export type PremImageHistory = {
  id: string;
  prompt: string;
  images: string[];
  timestamp: string;
};