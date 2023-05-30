import { PremChatResponse } from "modules/prem-chat/types";
import usePremChatWithoutStream from "./usePremChatWithoutStream";

const usePremChat = (serviceId: string, chatId: string | null): PremChatResponse => {
  return usePremChatWithoutStream(serviceId, chatId);
};

export default usePremChat;
