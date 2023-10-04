import axios from "axios";
import { isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { TranscriptionsGeneration } from "../types";

const generateTranscriptions = async (service: Service, data: TranscriptionsGeneration) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("model", data.model);
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "multipart/form-data" };
  if (isProxyEnabled() && isIP && service?.invokeMethod.header) {
    const [key, value] = service.invokeMethod.header.split(":");
    Object.assign(headers, { [key]: value });
  }
  return axios.post(`${service.invokeMethod.baseUrl}/v1/audio/transcriptions`, formData, {
    headers,
  });
};

export default generateTranscriptions;
