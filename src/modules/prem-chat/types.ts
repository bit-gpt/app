import type { RightSidebarProps } from "shared/types";

import type { Service } from "../service/types";

export type Message = {
  role: string;
  content: string;
};

export type ChatCompletionInputData = {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty: number;
  stream?: boolean;
  n: number;
  presence_penalty: number;
};

export interface PremChatHistory {
  id: string;
  model: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export type PremChatResponse = {
  chatMessages: Message[];
  onSubmit: (e: React.FormEvent) => void;
  question: string;
  setQuestion: (question: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRegenerate: () => void;
  resetPromptTemplate: () => void;
  resetChatServiceUrl: () => void;
  abort: () => void;
};

export type InputBoxProps = {
  question: string;
  setQuestion: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export type RegenerateButtonProps = {
  onRegenerateClick: () => void;
};

export type PremChatContainerProps = {
  historyId?: string;
  serviceId: string;
  serviceType: Service["serviceType"];
  serviceName: string;
  isPetals: boolean;
};

export interface ChatRightSidebarProps extends RightSidebarProps {
  resetPromptTemplate: () => void;
  resetChatServiceUrl: () => void;
}
