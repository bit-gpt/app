import { useQuery } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";
import { isDesktopEnv } from "../helpers/utils";

export const SERVICE_KEY = "fetchRegistries";

const useFetchRegistries = () => {
  let serviceType: Service["serviceType"];
  if (isDesktopEnv()) {
    serviceType = "binary";
  } else {
    serviceType = "docker";
  }
  const controller = ServiceController.getInstance();
  return useQuery({
    queryKey: [SERVICE_KEY],
    queryFn: () => controller.fetchRegistries(serviceType),
  });
};

export default useFetchRegistries;
