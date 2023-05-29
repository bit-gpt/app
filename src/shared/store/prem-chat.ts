import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, PremChatHistory } from "modules/prem-chat/types";

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

const usePremChatStore = create<PremChatStore>()(
  persist(
    (set) => ({
      history: [],
      clearHistory: () => set(() => ({ history: [] })),
      addHistory: (newHistory: PremChatHistory) =>
        set((state) => ({ history: [...state.history, newHistory] })),
      updateHistoryMessages: (id, messages) =>
        set((state) => ({
          history: state.history.map((_history) => {
            if (_history.id === id) {
              return {
                ..._history,
                timestamp: Date.now(),
                messages,
              };
            }
            return _history;
          }),
        })),
      deleteHistory: (id: string) =>
        set((state) => ({
          history: state.history.filter((_history) => _history.id !== id),
        })),
      temperature: 1,
      setTemperature: (temperature) => set(() => ({ temperature })),
      max_tokens: 10,
      setMaxTokens: (max_tokens) => set(() => ({ max_tokens })),
      top_p: 1,
      setTopP: (top_p) => set(() => ({ top_p })),
      frequency_penalty: 0,
      setFrequencyPenalty: (frequency_penalty) =>
        set(() => ({ frequency_penalty })),
      n: 1,
      setN: (n) => set(() => ({ n })),
      presence_penalty: 0,
      setPresencePenalty: (presence_penalty) =>
        set(() => ({ presence_penalty })),
    }),
    {
      name: "prem-chat",
    }
  )
);

export default usePremChatStore;
