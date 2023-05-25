import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Message } from "../types";

const stopService = async (
  serviceId: string
): Promise<AxiosResponse<Message>> =>
  api.get(`api/v1/stop-service/${serviceId}`);

export default stopService;
