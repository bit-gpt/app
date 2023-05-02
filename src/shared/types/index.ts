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
};
