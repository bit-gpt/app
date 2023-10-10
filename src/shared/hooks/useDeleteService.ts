import { useMutation } from "@tanstack/react-query";

import serviceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

const useDeleteService = () => {
  const controller = new serviceController();
  return useMutation(
    ({ serviceId, serviceType }: { serviceId: string; serviceType: Service["serviceType"] }) => {
      return controller.delete(serviceId, serviceType);
    },
  );
};

export default useDeleteService;
