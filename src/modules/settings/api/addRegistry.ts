import axios, { AxiosResponse } from "axios";
import { Registries } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";
import { Message } from "modules/service/types";

const addRegistry = async (data: Registries): Promise<AxiosResponse<Message>> => {
  const backendUrl = getBackendUrlFromStore();
  return axios.post(`${backendUrl}/v1/registries/`, data);
};

export default addRegistry;
