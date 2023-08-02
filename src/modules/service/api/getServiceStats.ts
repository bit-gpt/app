import type { AxiosResponse } from "axios";
import api from "shared/api/v1";

import type { ServiceStats } from "../types";

const getServiceStats = async (id: string): Promise<AxiosResponse<ServiceStats>> =>
  api().get(`v1/stats/${id}`);

export default getServiceStats;
