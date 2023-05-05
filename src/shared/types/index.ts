export type Message = {
  role: string;
  content: string;
};

export type ChatCompletion = {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
};

export interface PremChatHistory {
  id: string;
  model: string;
  title: string;
  messages: Message[];
  timestamp: number;
};

export type PremChatResponse = {
  chatMessages: Message[];
  onSubmit: (e: React.FormEvent) => void;
  question: string;
  setQuestion: (question: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRegenerate: () => void;
};

export interface PremChatHistoryNavigator extends PremChatHistory {
  next?: PremChatHistory;
  prev?: PremChatHistory;
}