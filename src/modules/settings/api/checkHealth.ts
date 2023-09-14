import type { AxiosResponse } from "axios";

import api from "../../../shared/api/v1";
import type { Health } from "../types";

const checkHealth = async (): Promise<AxiosResponse<Health>> => api().get(`v1`);

export default checkHealth;
