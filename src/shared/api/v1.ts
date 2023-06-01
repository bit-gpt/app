import axios from "axios";
import { BACKEND_URL } from "shared/store/setting";

const api = () => {
  const client = axios.create({
    baseURL: BACKEND_URL(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return client;
};

export default api;
