import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Stats, GPUStats } from "../types";

const getGPUStats = async (): Promise<AxiosResponse<GPUStats>> => api().get("v1/gpu-stats-all/");

export default getGPUStats;
