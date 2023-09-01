import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const apiDnsd = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  if (isProxyEnabled() && isIP) {
    Object.assign(headers, { "X-Host-Override": "dnsd" });
  }
  return axios.create({
    baseURL: useSettingStore.getState().backendUrl,
    headers,
  });
};

export default apiDnsd;
