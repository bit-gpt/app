import type { AxiosResponse } from "axios";
import api from "shared/api/v1";

import type { Message } from "../types";

const restartService = async (serviceId: string): Promise<AxiosResponse<Message>> =>
  api().get(`v1/restart-service/${serviceId}`);

export default restartService;
