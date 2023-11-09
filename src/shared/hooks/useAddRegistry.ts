import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";
import type { Registry } from "../../modules/settings/types";
import { isDesktopEnv } from "../helpers/utils";

const useAddRegistry = () => {
  const controller = ServiceController.getInstance();
  let serviceType: Service["serviceType"];
  if (isDesktopEnv()) {
    serviceType = "binary";
  } else {
    serviceType = "docker";
  }
  return useMutation({
    mutationFn: (registry: Registry) => controller.addRegistry(registry, serviceType),
  });
};

export default useAddRegistry;
