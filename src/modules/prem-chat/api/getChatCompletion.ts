import api from "shared/api/v1";
import { ChatCompletionInputData } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";

const getChatCompletion = async (port: number, data: ChatCompletionInputData) => {
  const backendUrl = new URL(getBackendUrlFromStore());
  backendUrl.port = `${port}`;
  
  return api().post(
    `${backendUrl}api/v1/chat/completions`,
    data
  );
};

export default getChatCompletion;
