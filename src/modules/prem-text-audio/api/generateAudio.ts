import axios from "axios";

import type { Service } from "../../service/types";
import type { AudioGenerationData } from "../types";

const generateAudio = async (service: Service, data: AudioGenerationData) => {
  const headers = { "Content-Type": "application/json" };
  return axios.post(`${service.baseUrl}/v1/audio/generation`, data, { headers });
};

export default generateAudio;
