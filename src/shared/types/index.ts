export type Message = {
  role: string;
  content: string;
};

export type ChatCompletion = {
  model: string;
  messages: Message[];
};

export type PremChatHistory = {
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
};
