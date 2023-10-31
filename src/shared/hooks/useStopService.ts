import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";

const useStopService = () => {
  const controller = ServiceController.getInstance();
  return useMutation({
    mutationFn: ({ serviceId, serviceType }: { serviceId: string; serviceType: string }) =>
      controller.stop(serviceId, serviceType),
  });
};

export default useStopService;
