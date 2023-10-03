import axios from "axios";
import { getServiceUrl } from "shared/helpers/utils";

import type { Service } from "../../service/types";
import type { AudioGenerationData } from "../types";

const generateAudio = async (service: Service, data: AudioGenerationData) => {
  const backendUrl = getServiceUrl(service.id, service.runningPort, "v1/audio/generation");

  return axios.post(`${backendUrl}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default generateAudio;
