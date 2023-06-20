export type ImageGeneration = {
  prompt: string;
  n?: number;
  size?: string;
  response_format?: string;
};

export type UrlResponse = {
  url: string;
};

export type PremImageResponse = {
  onSubmit: () => void;
  prompt: string;
  setPrompt: (question: string) => void;
  isLoading: boolean;
  isError: boolean;
  images: UrlResponse[];
  n: number;
};