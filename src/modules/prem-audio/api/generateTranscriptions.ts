import axios from "axios";
import { getServiceUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { Service } from "../../service/types";
import type { TranscriptionsGeneration } from "../types";

const generateTranscriptions = async (service: Service, data: TranscriptionsGeneration) => {
  const backendUrl = getServiceUrl(service.invokeMethod, "v1/audio/transcriptions");
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("model", data.model);

  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "multipart/form-data" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, service.invokeMethod.header);
  }
  return axios.post(backendUrl, formData, { headers });
};

export default generateTranscriptions;
