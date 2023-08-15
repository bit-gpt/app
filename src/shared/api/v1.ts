import axios from "axios";

import useSettingStore from "../store/setting";

const api = () => {
  return axios.create({
    baseURL: useSettingStore.getState().backendUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default api;
