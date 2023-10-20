import type { Service } from "../modules/service/types";

import type { DownloadArgs } from "./serviceController";

abstract class AbstractServiceController {
  abstract start(serviceId: string): void;
  abstract restart(serviceId: string): void;
  abstract stop(serviceId: string): void;
  abstract delete(serviceId: string): void;
  abstract download({
    serviceId,
    binariesUrl,
    weightsDirectoryUrl,
    weightsFiles,
    afterSuccess,
  }: DownloadArgs): void;
  abstract getService(serviceId: string): Promise<Service | undefined>;
  abstract getServices(): Promise<Service[] | undefined>;
  abstract getLogs(serviceId: string): Promise<string>;
  abstract getServiceStats(serviceId: string): Promise<Record<string, string>>;
  abstract getSystemStats(): Promise<Record<string, string>>;
  abstract getGPUStats(): Promise<Record<string, string>>;
}

export default AbstractServiceController;
