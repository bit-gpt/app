import axios from "axios";
import { generateUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { ImageGeneration } from "../types";

const generateUpscalerImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(useSettingStore.getState().backendUrl, port, "v1/images/upscale");
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("prompt", data.prompt);
  formData.append("n", `${data.n}`);
  formData.append("response_format", data.response_format);
  formData.append("guidance_scale", `${data.guidance_scale}`);
  formData.append("num_inference_steps", `${data.num_inference_steps}`);

  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "multipart/form-data" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, { Host: "premd.docker.localhost" });
  }

  return axios.post(`${backendUrl}`, formData, { headers });
};

export default generateUpscalerImage;
