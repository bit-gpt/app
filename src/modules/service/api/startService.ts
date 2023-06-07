import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Message } from "../types";

const startService = async (serviceId: string): Promise<AxiosResponse<Message>> =>
  api().post(`v1/run-service/`, { id: serviceId });

export default startService;
