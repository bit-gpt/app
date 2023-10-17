import type { DownloadArgs } from "./serviceController";

abstract class AbstractServiceController {
  abstract start(serviceId: string): void;
  abstract restart(serviceId: string): void;
  abstract stop(serviceId: string): void;
  abstract delete(serviceId: string): void;
  abstract download({ serviceId, huggingFaceId, modelFiles, afterSuccess }: DownloadArgs): void;
  abstract getService(serviceId: string): void;
  abstract getServices(): void;
  abstract getLogs(serviceId: string): void;
}

export default AbstractServiceController;
