import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Service } from "../types";

const addService = async (data: Service): Promise<AxiosResponse<Service>> =>
  api().post("v1/services/", data);

export default addService;
