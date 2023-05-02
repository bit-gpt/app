import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, PremChatHistory } from "../types";

export type PremChatStore = {
  model: string;
  setModel: (model: string) => void;
  history: PremChatHistory[];
  setHistory: (history: PremChatHistory[]) => void;
  addHistory: (newHistory: PremChatHistory) => void;
  updateHistoryMessages: (id: string, messages: Message[]) => void;
};

const usePremChatStore = create<PremChatStore>()(
  persist(
    (set) => ({
      model: "",
      setModel: (model) => set(() => ({ model })),
      history: [],
      setHistory: (history) => set(() => ({ history })),
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
    }),
    {
      name: "prem-chat",
    }
  )
);

export default usePremChatStore;
