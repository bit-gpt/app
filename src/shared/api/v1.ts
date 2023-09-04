import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const api = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  let baseURL = useSettingStore.getState().backendUrl;
  if (isProxyEnabled()) {
    if (isIP) {
      Object.assign(headers, { "X-Host-Override": "premd" });
    } else {
      const arr = baseURL.split("://");
      baseURL = arr[0] + "://premd." + arr[1];
    }
  }
  return axios.create({
    baseURL,
    headers,
  });
};

export default api;
