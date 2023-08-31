import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const api = () => {
  const hasDnsRecord = useSettingStore.getState().hasDnsRecord;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && hasDnsRecord) {
    Object.assign(headers, { Host: "premd.docker.localhost" });
  }
  console.log("headers", headers);
  console.log("hasDnsRecord", hasDnsRecord);
  console.log("isProxyEnabled", isProxyEnabled());
  return axios.create({
    baseURL: useSettingStore.getState().backendUrl,
    headers,
  });
};

export default api;
