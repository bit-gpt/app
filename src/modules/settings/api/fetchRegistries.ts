import axios, { AxiosResponse } from "axios";

import { Registries } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";
const fetchRegistries = async (): Promise<AxiosResponse<Registries[]>> => {
  const backendUrl = getBackendUrlFromStore();
  return axios.get(`${backendUrl}/v1/registries/`);
};

export default fetchRegistries;
