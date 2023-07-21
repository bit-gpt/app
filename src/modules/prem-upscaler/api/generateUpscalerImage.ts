import axios from "axios";
import { ImageGeneration } from "../types";
import { generateUrl } from "shared/helpers/utils";
import { getBackendUrlFromStore } from "shared/store/setting";

const generateUpscalerImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "v1/images/upscale");
  const formData = new FormData();
  formData.append("image", data.image);
  formData.append("prompt", data.prompt);
  formData.append("n", `${data.n}`);
  formData.append("response_format", data.response_format);
  formData.append("guidance_scale", `${data.guidance_scale}`);
  formData.append("num_inference_steps", `${data.num_inference_steps}`);

  return axios.post(`${backendUrl}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default generateUpscalerImage;
