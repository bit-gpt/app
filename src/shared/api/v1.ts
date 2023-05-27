import axios from "axios";
import { BACKEND_URL } from "../helpers/utils";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  },
});

export default api;
