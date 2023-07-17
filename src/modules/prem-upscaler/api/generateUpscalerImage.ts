import axios from "axios";
import { ImageGeneration } from "../types";
import { generateUrl } from "shared/helpers/utils";
import { getBackendUrlFromStore } from "shared/store/setting";

const generateUpscalerImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "v1/image/generate");
  const formData = new FormData();
  formData.append("file", data.file);

  return axios.post(`${backendUrl}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default generateUpscalerImage;
