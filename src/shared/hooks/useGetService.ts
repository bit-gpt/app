import { useQuery } from "@tanstack/react-query";
import { SERVICE_CHECK_REFETCH_INTERVAL } from "shared/helpers/utils";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

export const SERVICE_KEY = "getService";

const useGetService = (
  serviceId: string,
  serviceType: Service["serviceType"],
  refetchInterval = true,
) => {
  const controller = new ServiceController();
  return useQuery([SERVICE_KEY, serviceId], () => controller.getService(serviceId, serviceType), {
    refetchInterval: refetchInterval ? SERVICE_CHECK_REFETCH_INTERVAL : false,
  });
};

export default useGetService;
