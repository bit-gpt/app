import axios from "axios";
import { ImageGeneration } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";
import { generateUrl } from "shared/helpers/utils";

const generateImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "api/v1/images/generations");

  return axios.post(`${backendUrl}`, data, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
};

export default generateImage;
