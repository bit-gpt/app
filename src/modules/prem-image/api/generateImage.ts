import axios from "axios";
import { isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { ImageGeneration } from "../types";

const generateImage = async (service: Service, data: ImageGeneration) => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && isIP && service?.invokeMethod.header) {
    const [key, value] = service.invokeMethod.header.split(":");
    Object.assign(headers, { [key]: value });
  }
  return axios.post(`${service.invokeMethod.baseUrl}/v1/images/generation`, data, { headers });
};

export default generateImage;
