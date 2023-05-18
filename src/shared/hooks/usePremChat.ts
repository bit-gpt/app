import { PremChatResponse } from "modules/prem-chat/types";
import usePremChatStream from "./usePremChatStream";
import usePremChatWithoutStream from "./usePremChatWithoutStream";

const usePremChat = (chatId: string | null): PremChatResponse => {
  return +import.meta.env.VITE_ENABLE_STREAMING
    ? usePremChatStream(chatId)
    : usePremChatWithoutStream(chatId);
};

export default usePremChat;
