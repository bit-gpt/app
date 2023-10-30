import { useQuery } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

const useServiceStats = (serviceId: string, serviceType: Service["serviceType"]) => {
  const controller = ServiceController.getInstance();
  return useQuery({
    queryKey: ["getServiceStats", serviceId],
    queryFn: () => controller.getServiceStats(serviceId, serviceType),
  });
};

export default useServiceStats;
