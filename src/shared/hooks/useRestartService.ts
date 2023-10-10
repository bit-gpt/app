import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";

const useRestartService = () => {
  const controller = new ServiceController();
  return useMutation(({ serviceId, serviceType }: { serviceId: string; serviceType: string }) =>
    controller.restart(serviceId, serviceType),
  );
};

export default useRestartService;
