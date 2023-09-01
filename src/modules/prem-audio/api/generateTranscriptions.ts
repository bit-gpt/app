import axios from "axios";
import { generateUrl, isProxyEnabled } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { TranscriptionsGeneration } from "../types";

const generateTranscriptions = async (port: number, data: TranscriptionsGeneration) => {
  const backendUrl = generateUrl(
    useSettingStore.getState().backendUrl,
    port,
    "v1/audio/transcriptions",
  );
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("model", data.model);

  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "multipart/form-data" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, { Host: "premd.docker.localhost" });
  }
  return axios.post(`${backendUrl}`, formData, { headers });
};

export default generateTranscriptions;
