import axios from "axios";
import { getServiceUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { AudioGenerationData } from "../types";

const generateAudio = async (service: Service, data: AudioGenerationData) => {
  const backendUrl = getServiceUrl(service.invokeMethod, "v1/audio/generation");
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, service.invokeMethod.header);
  }
  return axios.post(`${backendUrl}`, data, { headers });
};

export default generateAudio;
