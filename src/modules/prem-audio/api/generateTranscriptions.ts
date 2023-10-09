import axios from "axios";

import type { Service } from "../../service/types";
import type { TranscriptionsGeneration } from "../types";

const generateTranscriptions = async (service: Service, data: TranscriptionsGeneration) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("model", data.model);
  const headers = { "Content-Type": "multipart/form-data" };
  return axios.post(`${service.baseUrl}/v1/audio/transcriptions`, formData, {
    headers,
  });
};

export default generateTranscriptions;
