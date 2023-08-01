import type { AxiosResponse } from "axios";
import axios from "axios";
import { getBackendUrlFromStore } from "shared/store/setting";

import type { Registries } from "../types";

const fetchRegistries = async (): Promise<AxiosResponse<Registries[]>> => {
  const backendUrl = getBackendUrlFromStore();
  return axios.get(`${backendUrl}/v1/registries/`);
};

export default fetchRegistries;
