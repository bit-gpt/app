import type { AxiosResponse } from "axios";
import axios from "axios";
import type { Message } from "modules/service/types";

import useSettingStore from "../../../shared/store/setting";
import type { Registries } from "../types";

const addRegistry = async (data: Registries): Promise<AxiosResponse<Message>> => {
  const backendUrl = useSettingStore.getState().backendUrl;
  return axios.post(`${backendUrl}/v1/registries/`, data);
};

export default addRegistry;
