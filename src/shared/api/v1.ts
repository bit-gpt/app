import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + import.meta.env.VITE_BACKEND_TOKEN,
  },
});

export default api;
