import axios from "axios";

import { getBackendUrlFromStore } from "../store/setting";

const api = () => {
  return axios.create({
    baseURL: getBackendUrlFromStore(),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default api;
