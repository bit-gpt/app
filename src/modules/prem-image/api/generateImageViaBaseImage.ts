import axios from "axios";
import { isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { ImageGeneration } from "../types";

const generateImageViaBaseImage = async (service: Service, image: File, data: ImageGeneration) => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("prompt", data.prompt);
  formData.append("n", `${data.n}`);
  formData.append("size", `${data.size}`);
  formData.append("response_format", `${data.response_format}`);
  formData.append("negative_prompt", `${data.negative_prompt || ""}`);
  formData.append("seed", `${data.seed}`);

  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "multipart/form-data" };
  if (isProxyEnabled() && isIP && service?.invokeMethod.header) {
    const [key, value] = service.invokeMethod.header.split(":");
    Object.assign(headers, { [key]: value });
  }
  return axios.post(`${service.invokeMethod.baseUrl}/v1/images/edits`, formData, { headers });
};

export default generateImageViaBaseImage;
