import api from "shared/api/v1";
import { ChatCompletionInputData } from "../types";
import { getServerUrl } from "shared/helpers/utils";

const getChatCompletion = async (port: number, data: ChatCompletionInputData) => {
  const serverUrl = new URL(getServerUrl());
  serverUrl.port = `${port}`;

  return api().post(`${serverUrl}api/v1/chat/completions`, data);
};

export default getChatCompletion;
