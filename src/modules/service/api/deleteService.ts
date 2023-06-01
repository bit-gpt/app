import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { Message } from "../types";

const deleteService = async (
  serviceId: string
): Promise<AxiosResponse<Message>> =>
  api().get(`v1/remove-service/${serviceId}`);

export default deleteService;
