import type { AxiosResponse } from "axios";
import api from "shared/api/v1";

import type { Service } from "../../service/types";

const getService = async (id: string): Promise<AxiosResponse<Service>> =>
  api().get(`v1/services/${id}`);

export default getService;
