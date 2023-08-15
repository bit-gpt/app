import type { AxiosResponse } from "axios";
import axios from "axios";

import useSettingStore from "../../../shared/store/setting";
import type { Registries } from "../types";

const fetchRegistries = async (): Promise<AxiosResponse<Registries[]>> => {
  const backendUrl = useSettingStore.getState().backendUrl;
  return axios.get(`${backendUrl}/v1/registries/`);
};

export default fetchRegistries;
