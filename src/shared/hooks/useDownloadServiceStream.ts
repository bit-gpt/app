import { useMutation } from "@tanstack/react-query";

import type { DownloadArgs } from "../../controller/serviceController";
import ServiceController from "../../controller/serviceController";

const useDownloadServiceStream = () => {
  const controller = ServiceController.getInstance();
  return useMutation(
    ({
      serviceId,
      huggingFaceId,
      modelFiles,
      serviceType,
      afterSuccess,
    }: DownloadArgs & { serviceType: string }) =>
      controller.download({ serviceId, huggingFaceId, modelFiles, serviceType, afterSuccess }),
  );
};

export default useDownloadServiceStream;
