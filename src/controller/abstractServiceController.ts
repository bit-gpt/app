import type { Service } from "../modules/service/types";
import type { Registry } from "../modules/settings/types";
import type { Interface } from "../shared/helpers/interfaces";

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
  abstract getService(serviceId: string): Promise<Service>;
  abstract getServices(): Promise<Service[]>;
  abstract getLogs(serviceId: string): Promise<string>;
  abstract getServiceStats(serviceId: string): Promise<Record<string, string>>;
  abstract getSystemStats(): Promise<Record<string, string>>;
  abstract getGPUStats(): Promise<Record<string, string>>;
  abstract getInterfaces(): Promise<Interface[]>;
  abstract addService(service: Service): Promise<void>;
  abstract addRegistry(registry: Registry): Promise<void>;
  abstract deleteRegistry(registry: Registry): Promise<void>;
  abstract fetchRegistries(): Promise<Registry[]>;
  abstract resetDefaultRegistry(): Promise<void>;
}

export default AbstractServiceController;
