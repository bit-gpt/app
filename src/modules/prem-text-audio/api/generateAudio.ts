import axios from "axios";
import { generateUrl } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { AudioGenerationData } from "../types";

const generateAudio = async (port: number, data: AudioGenerationData) => {
  const backendUrl = generateUrl(
    useSettingStore.getState().backendUrl,
    port,
    "v1/audio/generation",
  );

  return axios.post(`${backendUrl}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default generateAudio;
