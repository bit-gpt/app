import { useMutation } from "@tanstack/react-query";

import type { DownloadArgs } from "../../controller/serviceController";
import ServiceController from "../../controller/serviceController";

const useDownloadServiceStream = () => {
  const controller = ServiceController.getInstance();
  return useMutation({
    mutationFn: ({
      serviceId,
      binariesUrl,
      weightsDirectoryUrl,
      weightsFiles,
      serviceType,
      afterSuccess,
    }: DownloadArgs & { serviceType: string }) =>
      controller.download({
        serviceId,
        binariesUrl,
        weightsDirectoryUrl,
        weightsFiles,
        serviceType,
        afterSuccess,
      }),
  });
};

export default useDownloadServiceStream;
