import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";

const useRestartService = () => {
  const controller = ServiceController.getInstance();
  return useMutation(({ serviceId, serviceType }: { serviceId: string; serviceType: string }) =>
    controller.restart(serviceId, serviceType),
  );
};

export default useRestartService;
