import axios from "axios";
import { TranscriptionsGeneration } from "../types";

const generateTranscriptions = async (port: number, data: TranscriptionsGeneration) => {
  const backendUrl = "https://api.openai.com/v1/audio/transcriptions";

  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("model", data.model);

  return axios.post(`${backendUrl}`, formData, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export default generateTranscriptions;
