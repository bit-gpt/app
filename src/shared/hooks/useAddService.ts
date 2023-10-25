import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

const useAddService = () => {
  const controller = ServiceController.getInstance();
  return useMutation(
    ({ service, serviceType }: { service: Service; serviceType: Service["serviceType"] }) => {
      return controller.addService(service, serviceType);
    },
  );
};

export default useAddService;
