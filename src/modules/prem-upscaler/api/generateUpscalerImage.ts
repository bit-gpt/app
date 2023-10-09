import axios from "axios";

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
  const headers = { "Content-Type": "multipart/form-data" };
  return axios.post(`${service.baseUrl}/v1/images/upscale`, formData, { headers });
};

export default generateUpscalerImage;
