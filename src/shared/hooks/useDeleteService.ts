import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

const useDeleteService = () => {
  const controller = ServiceController.getInstance();
  return useMutation({
    mutationFn: ({
      serviceId,
      serviceType,
    }: {
      serviceId: string;
      serviceType: Service["serviceType"];
    }) => {
      return controller.delete(serviceId, serviceType);
    },
  });
};

export default useDeleteService;
