import type { AxiosResponse } from "axios";
import api from "shared/api/v1";

import type { Message } from "../types";

const stopService = async (serviceId: string): Promise<AxiosResponse<Message>> =>
  api().get(`v1/stop-service/${serviceId}`);

export default stopService;
