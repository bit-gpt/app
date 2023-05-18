import api from "shared/api/v1";
import { ChatCompletionInputData } from "../types";

const getChatCompletion = async (data: ChatCompletionInputData) => {
  return api.post(
    `${import.meta.env.VITE_BACKEND_NEW_URL}/v1/chat/completions`,
    data
  );
};

export default getChatCompletion;
