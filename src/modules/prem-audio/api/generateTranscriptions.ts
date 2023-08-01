import axios from "axios";
import { generateUrl } from "shared/helpers/utils";
import { getBackendUrlFromStore } from "shared/store/setting";

import type { TranscriptionsGeneration } from "../types";

const generateTranscriptions = async (port: number, data: TranscriptionsGeneration) => {
  const backendUrl = generateUrl(getBackendUrlFromStore(), port, "v1/audio/transcriptions");
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("model", data.model);

  return axios.post(`${backendUrl}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default generateTranscriptions;
