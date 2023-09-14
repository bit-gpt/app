import type { AxiosResponse } from "axios";

import api from "../../../shared/api/v1";
import type { Registries } from "../types";

const fetchRegistries = async (): Promise<AxiosResponse<Registries[]>> => {
  return api().get(`v1/registries/`);
};

export default fetchRegistries;
