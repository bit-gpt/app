import { useQuery } from "@tanstack/react-query";
import { isDesktopEnv, SERVICE_CHECK_REFETCH_INTERVAL } from "shared/helpers/utils";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

export const SERVICES_KEY = "getServices";

const useGetServices = () => {
  const controller = ServiceController.getInstance();
  // Here we check the env to determine if we should use the binary or docker service
  // and fetch the services accordingly
  let serviceType: Service["serviceType"];
  if (isDesktopEnv()) {
    serviceType = "binary";
  } else {
    serviceType = "docker";
  }
  return useQuery({
    queryKey: [SERVICES_KEY],
    queryFn: () => controller.getServices(serviceType),
    refetchInterval: SERVICE_CHECK_REFETCH_INTERVAL,
  });
};

export default useGetServices;
