import axios from "axios";
import { generateUrl } from "shared/helpers/utils";

import useSettingStore from "../../../shared/store/setting";
import type { ImageGeneration } from "../types";

const generateImage = async (port: number, data: ImageGeneration) => {
  const backendUrl = generateUrl(
    useSettingStore.getState().backendUrl,
    port,
    "v1/images/generations",
  );

  return axios.post(`${backendUrl}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default generateImage;
