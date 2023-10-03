import axios from "axios";
import { generateUrl, getServiceUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { ImageGeneration } from "../types";

const generateImage = async (service: Service, data: ImageGeneration) => {
  const backendUrl = generateUrl(
    getServiceUrl(service.id),
    service.runningPort,
    "v1/images/generations",
  );
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, { Host: "premd.docker.localhost" });
  }
  return axios.post(`${backendUrl}`, data, { headers });
};

export default generateImage;
