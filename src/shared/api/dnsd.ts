import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const apiDnsd = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  let baseURL = useSettingStore.getState().backendUrl;
  if (isProxyEnabled()) {
    if (isIP) {
      baseURL = `${useSettingStore.getState().backendUrl}dnsd/`;
    } else {
      baseURL = `${window.location.protocol}//dnsd.${window.location.host}/`;
    }
  }
  return axios.create({
    baseURL,
    headers,
  });
};

export default apiDnsd;
