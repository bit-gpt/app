import type { AxiosResponse } from "axios";
import type { Message } from "modules/service/types";

import api from "../../../shared/api/v1";
import type { Registries } from "../types";

const deleteRegistry = async (data: Registries): Promise<AxiosResponse<Message>> => {
  return api().delete(`v1/registries/?url=${data.url}`);
};

export default deleteRegistry;
