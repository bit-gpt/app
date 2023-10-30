import { useQuery } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";
import { isDesktopEnv } from "../helpers/utils";

const useInterfaces = () => {
  const controller = ServiceController.getInstance();
  // Here we check the env to determine if we should use the binary or docker service
  // and fetch the services accordingly
  let serviceType: Service["serviceType"];
  if (isDesktopEnv()) {
    serviceType = "binary";
  } else {
    serviceType = "docker";
  }
  return useQuery({ queryKey: ["getApps"], queryFn: () => controller.getInterfaces(serviceType) });
};

export default useInterfaces;
