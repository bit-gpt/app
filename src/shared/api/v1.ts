import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const api = () => {
  const hasDnsRecord = useSettingStore.getState().hasDnsRecord;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && hasDnsRecord) {
    Object.assign(headers, { Host: "premd.docker.localhost" });
  }
  return axios.create({
    baseURL: useSettingStore.getState().backendUrl,
    headers,
  });
};

export default api;
