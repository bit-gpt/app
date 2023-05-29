import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Stats } from "../types";

const getSystemStats = async (): Promise<AxiosResponse<Stats>> =>
  api.get("v1/stats-all/");

export default getSystemStats;
