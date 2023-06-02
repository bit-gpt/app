import axios from "axios";
import { getBackendUrlFromStore } from "shared/store/setting";

const api = () => {
  const client = axios.create({
    baseURL: getBackendUrlFromStore(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return client;
};

export default api;
