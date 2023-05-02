import { ChatCompletion } from "../types";
import api from "./api";

export const fetchStatus = async () => {
  return api.get("/v1/status/");
};

export const fetchModels = async () => {
  return api.get(`${import.meta.env.VITE_BACKEND_NEW_URL}/v1/models`);
};

export const chatCompletion = async (data: ChatCompletion) => {
  return api.post(
    `${import.meta.env.VITE_BACKEND_NEW_URL}/v1/chat/completions`,
    data
  );
};
