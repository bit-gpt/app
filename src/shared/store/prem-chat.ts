import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, PremChatHistory } from "../types";

export type PremChatStore = {
  model: string;
  setModel: (model: string) => void;
  history: PremChatHistory[];
  setHistory: (history: PremChatHistory[]) => void;
};

const usePremChatStore = create<PremChatStore>()(
  persist(
    (set) => ({
      model: "",
      setModel: (model) => set(() => ({ model })),
      history: [],
      setHistory: (history) => set(() => ({ history })),
    }),
    {
      name: "prem-chat",
    }
  )
);

export default usePremChatStore;
