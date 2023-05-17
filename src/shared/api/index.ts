import { App, ChatCompletion } from "../types";
import api from "./api";

export const fetchModels = async () => {
  return api.get(`${import.meta.env.VITE_BACKEND_NEW_URL}/v1/models`);
};

export const chatCompletion = async (data: ChatCompletion) => {
  return api.post(
    `${import.meta.env.VITE_BACKEND_NEW_URL}/v1/chat/completions`,
    data
  );
};

export const fetchApps = async () => {
  return api.get<App[]>("api/v1/apps/");
};
