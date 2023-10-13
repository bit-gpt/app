import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const api = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  let baseURL = useSettingStore.getState().backendUrl;
  if (isProxyEnabled()) {
    if (isIP) {
      baseURL = `${useSettingStore.getState().backendUrl}premd/`;
    } else {
      baseURL = `${window.location.protocol}//premd.${window.location.host}/`;
    }
  }
  return axios.create({
    baseURL,
    headers,
  });
};

export default api;
