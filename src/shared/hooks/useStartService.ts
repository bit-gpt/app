import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

const useStartService = () => {
  const controller = new ServiceController();
  return useMutation(
    ({ serviceId, serviceType }: { serviceId: string; serviceType: Service["serviceType"] }) =>
      controller.start(serviceId, serviceType),
  );
};

export default useStartService;
