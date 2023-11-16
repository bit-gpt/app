import axios from "axios";

import { isProxyEnabled } from "../helpers/utils";
import useSettingStore from "../store/setting";

const apiAuthd = () => {
  const isIP = useSettingStore.getState().isIP;
  const headers = { "Content-Type": "application/json" };
  let baseURL;
  if (isProxyEnabled()) {
    if (isIP) {
      baseURL = `${useSettingStore.getState().backendUrl}authd/auth`;
    } else {
      baseURL = `${window.location.protocol}//authd.${window.location.host}/auth`;
    }
  }
  return axios.create({
    baseURL,
    headers,
  });
};

export default apiAuthd;
