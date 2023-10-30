import { useQuery } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

export const SERVICE_KEY = "getService";

const useGetService = (serviceId: string, serviceType: Service["serviceType"]) => {
  const controller = ServiceController.getInstance();
  return useQuery({
    queryKey: [SERVICE_KEY, serviceId],
    queryFn: () => controller.getService(serviceId, serviceType),
  });
};

export default useGetService;
