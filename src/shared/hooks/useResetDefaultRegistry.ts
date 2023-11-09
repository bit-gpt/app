import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";
import { isDesktopEnv } from "../helpers/utils";

const useResetDefaultRegistry = () => {
  const controller = ServiceController.getInstance();
  let serviceType: Service["serviceType"];
  if (isDesktopEnv()) {
    serviceType = "binary";
  } else {
    serviceType = "docker";
  }
  return useMutation({
    mutationFn: () => controller.resetDefaultRegistry(serviceType),
  });
};

export default useResetDefaultRegistry;
