import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const api = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, { "X-Host-Override": "premd" });
  }
  console.log("headers", headers);
  console.log("useSettingStore.getState().backendUrl", useSettingStore.getState().backendUrl);
  return axios.create({
    baseURL: useSettingStore.getState().backendUrl,
    headers,
  });
};

export default api;
