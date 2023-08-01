import axios from "axios";
import { generateUrl } from "shared/helpers/utils";
import { getBackendUrlFromStore } from "shared/store/setting";

import type { ImageGeneration } from "../types";

const generateImageViaBaseImage = async (port: number, image: File, data: ImageGeneration) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "v1/images/edits");

  const formData = new FormData();
  formData.append("image", image);
  formData.append("prompt", data.prompt);
  formData.append("n", `${data.n}`);
  formData.append("size", `${data.size}`);
  formData.append("response_format", `${data.response_format}`);
  formData.append("negative_prompt", `${data.negative_prompt || ""}`);
  formData.append("seed", `${data.seed}`);

  return axios.post(`${backendUrl}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default generateImageViaBaseImage;
