import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Message } from "../types";

const downloadService = async (
  serviceId: string
): Promise<AxiosResponse<Message>> =>
  api.get(`v1/download-service/${serviceId}`);

export default downloadService;
