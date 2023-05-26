import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { ServiceStats } from "../types";

const getServiceStats = async (id: string): Promise<AxiosResponse<ServiceStats>> =>
  api.get(`api/v1/stats/${id}`);

export default getServiceStats;
