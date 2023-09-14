import type { AxiosResponse } from "axios";
import type { Message } from "modules/service/types";

import api from "../../../shared/api/v1";
import type { Registries } from "../types";

const addRegistry = async (data: Registries): Promise<AxiosResponse<Message>> => {
  return api().post(`v1/registries/`, data);
};

export default addRegistry;
