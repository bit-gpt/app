import axios from "axios";
import { getServiceUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { ImageGeneration } from "../types";

const generateImage = async (service: Service, data: ImageGeneration) => {
  const backendUrl = getServiceUrl(service.invokeMethod, "v1/images/generations");
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, service.invokeMethod.header);
  }
  return axios.post(backendUrl, data, { headers });
};

export default generateImage;
