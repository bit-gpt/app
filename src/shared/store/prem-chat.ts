import type { PremChatHistory } from "modules/prem-chat/types";
import storage from "shared/helpers/custom-storage";
import type { PremChatStore } from "shared/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const usePremChatStore = create<PremChatStore>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        clearHistory: (serviceId: string) =>
          set((state) => ({
            history: state.history.filter((_history) => _history.model !== serviceId),
          })),
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
        temperature: 0.2,
        setTemperature: (temperature) => set(() => ({ temperature })),
        max_tokens: 256,
        setMaxTokens: (max_tokens) => set(() => ({ max_tokens })),
        top_p: 0.95,
        setTopP: (top_p) => set(() => ({ top_p })),
        frequency_penalty: 0,
        setFrequencyPenalty: (frequency_penalty) => set(() => ({ frequency_penalty })),
        n: 1,
        setN: (n) => set(() => ({ n })),
        presence_penalty: 0,
        setPresencePenalty: (presence_penalty) => set(() => ({ presence_penalty })),
        promptTemplate: "",
        setPromptTemplate: (promptTemplate) => set(() => ({ promptTemplate })),
        setChatServiceUrl: (chatServiceUrl) => set(() => ({ chatServiceUrl })),
        chatServiceUrl: "",
      }),
      {
        name: "prem-chat",
        storage: createJSONStorage(() => storage),
      },
    ),
    { name: "store", store: "prem-chat" },
  ),
);

export default usePremChatStore;
