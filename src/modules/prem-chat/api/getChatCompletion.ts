import api from "shared/api/v1";
import { ChatCompletionInputData } from "../types";

const getChatCompletion = async (port: number, data: ChatCompletionInputData) => {
  const backendUrl = `https://${data.model}.prem.ninja`;

  return api().post(`${backendUrl}/api/v1/chat/completions`, data);
};

export default getChatCompletion;