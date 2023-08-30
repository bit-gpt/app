import axios from "axios";
import { generateUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { ImageGeneration } from "../types";

const generateImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(
    useSettingStore.getState().backendUrl,
    port,
    "v1/images/generations",
  );
  const hasDnsRecord = useSettingStore.getState().hasDnsRecord;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && hasDnsRecord) {
    Object.assign(headers, { Host: "premd.docker.localhost" });
  }
  return axios.post(`${backendUrl}`, data, { headers });
};

export default generateImage;
