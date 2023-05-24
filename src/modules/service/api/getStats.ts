import { AxiosResponse } from "axios";
import api from "shared/api/v1";

const getStats = async (): Promise<AxiosResponse<any>> => api.get("api/v1/stats/");

export default getStats;
