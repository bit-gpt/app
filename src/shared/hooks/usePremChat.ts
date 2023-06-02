import { PremChatResponse } from "modules/prem-chat/types";
import usePremChatWithoutStream from "./usePremChatWithoutStream";
import usePremChatStream from "./usePremChatStream";

const usePremChat = (
  stream: boolean,
  serviceId: string,
  chatId: string | null
): PremChatResponse => {
  return stream
    ? usePremChatStream(serviceId, chatId)
    : usePremChatWithoutStream(serviceId, chatId);
};

export default usePremChat;
