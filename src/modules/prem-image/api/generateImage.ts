import axios from "axios";

import type { Service } from "../../service/types";
import type { ImageGeneration } from "../types";

const generateImage = async (service: Service, data: ImageGeneration) => {
  const headers = { "Content-Type": "application/json" };
  return axios.post(`${service.baseUrl}/v1/images/generations`, data, { headers });
};

export default generateImage;
