import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { App } from "../types";

const getApps = async (): Promise<AxiosResponse<App[]>> => {
  return api.get<App[]>("api/v1/apps/");
};

export default getApps;
