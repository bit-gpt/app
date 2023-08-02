import type { AxiosResponse } from "axios";
import axios from "axios";

import type { Health } from "../types";

const checkHealth = async (url: string): Promise<AxiosResponse<Health>> => axios.get(`${url}/v1/`);

export default checkHealth;
