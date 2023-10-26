import { useMutation } from "@tanstack/react-query";

import ServiceController from "../../controller/serviceController";
import type { Service } from "../../modules/service/types";

const useAddService = () => {
  const controller = ServiceController.getInstance();
  return useMutation(({ service }: { service: Service }) => {
    return controller.addService(service);
  });
};

export default useAddService;
