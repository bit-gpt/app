import axios from "axios";
import { ImageGeneration } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";
import { generateUrl } from "shared/helpers/utils";

const generateImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "v1/images/generations");

  return axios.post(`${backendUrl}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default generateImage;
