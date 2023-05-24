import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Stats } from "../types";

const getStats = async (): Promise<AxiosResponse<Stats>> => api.get("api/v1/stats-all/");

export default getStats;
