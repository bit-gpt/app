import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const apiDnsd = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  let baseURL = useSettingStore.getState().backendUrl;
  if (isProxyEnabled()) {
    if (isIP) {
      Object.assign(headers, { "X-Host-Override": "dnsd" });
    } else {
      const arr = baseURL.split("://");
      baseURL = arr[0] + "://dnsd." + arr[1];
    }
  }
  return axios.create({
    baseURL: useSettingStore.getState().backendUrl,
    headers,
  });
};

export default apiDnsd;
