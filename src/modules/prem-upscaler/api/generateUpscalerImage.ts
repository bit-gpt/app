import axios from "axios";
import { isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { ImageGeneration } from "../types";

const generateUpscalerImage = async (service: Service, data: ImageGeneration) => {
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("prompt", data.prompt);
  formData.append("n", `${data.n}`);
  formData.append("response_format", data.response_format);
  formData.append("guidance_scale", `${data.guidance_scale}`);
  formData.append("num_inference_steps", `${data.num_inference_steps}`);
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "multipart/form-data" };
  if (isProxyEnabled() && isIP && service?.invokeMethod.header) {
    const [key, value] = service.invokeMethod.header.split(":");
    Object.assign(headers, { [key]: value });
  }
  return axios.post(`${service.invokeMethod.baseUrl}/v1/images/upscale`, formData, { headers });
};

export default generateUpscalerImage;
