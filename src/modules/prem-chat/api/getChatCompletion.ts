import api from "shared/api/v1";
import { ChatCompletionInputData } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";
import { generateUrl } from "shared/helpers/utils";

const getChatCompletion = async (port: number, data: ChatCompletionInputData) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "api/v1/chat/completions");
  return api().post(`${backendUrl}`, data);
};

export default getChatCompletion;
