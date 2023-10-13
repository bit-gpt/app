import type { Service } from "../modules/service/types";

import BinariesController from "./binariesController";
import DockerController from "./dockerController";

export type DownloadArgs = {
  serviceId: string;
  huggingFaceId?: string;
  modelFiles?: string[];
  afterSuccess?: () => void;
};

interface IServiceController {
  start(serviceId: string, serviceType: string): Promise<void>;
  stop(serviceId: string, serviceType: string): Promise<void>;
  restart(serviceId: string, serviceType: string): Promise<void>;
  delete(serviceId: string, serviceType: string): Promise<void>;
  download({
    serviceId,
    huggingFaceId,
    modelFiles,
    serviceType,
    afterSuccess,
  }: DownloadArgs & { serviceType: string }): Promise<void>;
  getService(serviceId: string, serviceType: string): Promise<Service>;
  getServices(serviceType: string): Promise<Service[]>;
  getLogs(serviceId: string, serviceType: string): Promise<void>;
}

class ServiceController implements IServiceController {
  private dockerController: DockerController;
  private binariesController: BinariesController;
  private static instance: ServiceController;
  constructor() {
    this.binariesController = new BinariesController();
    this.dockerController = new DockerController();
  }

  public static getInstance(): ServiceController {
    if (!ServiceController.instance) {
      ServiceController.instance = new ServiceController();
    }
    return ServiceController.instance;
  }

  async start(serviceId: string, serviceType: Service["serviceType"]): Promise<void> {
    if (serviceType === "docker") {
      await this.dockerController.start(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.start(serviceId);
    }
  }

  async stop(serviceId: string, serviceType: string): Promise<void> {
    if (serviceType === "docker") {
      await this.dockerController.stop(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.stop(serviceId);
    }
  }

  async restart(serviceId: string, serviceType: string): Promise<void> {
    if (serviceType === "docker") {
      await this.dockerController.restart(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.restart(serviceId);
    }
  }

  async delete(serviceId: string, serviceType: string): Promise<void> {
    if (serviceType === "docker") {
      await this.dockerController.delete(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.delete(serviceId);
    }
  }

  async download({
    serviceId,
    huggingFaceId,
    modelFiles,
    serviceType,
    afterSuccess,
  }: DownloadArgs & { serviceType: string }): Promise<void> {
    if (serviceType === "docker") {
      await this.dockerController.download({ serviceId, afterSuccess });
    } else if (serviceType === "binary") {
      await this.binariesController.download({
        serviceId,
        huggingFaceId,
        modelFiles,
        afterSuccess,
      });
    }
  }

  async getService(serviceId: string, serviceType: string): Promise<Service> {
    if (serviceType === "docker") {
      return (await this.dockerController.getService(serviceId)) ?? ({} as Service);
    } else if (serviceType === "binary") {
      return (await this.binariesController.getService(serviceId)) ?? ({} as Service);
    } else {
      return {} as Service;
    }
  }

  async getServices(serviceType: Service["serviceType"]): Promise<Service[]> {
    // To get all services at startup we check the env (browser or desktop) to determine serviceType
    if (serviceType === "docker") {
      return (await this.dockerController.getServices()) ?? [];
    } else if (serviceType === "binary") {
      return (await this.binariesController.getServices()) ?? [];
    } else {
      return [];
    }
  }

  async getLogs(serviceId: string, serviceType: string): Promise<void> {
    if (serviceType === "docker") {
      await this.dockerController.getLogs(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.getLogs(serviceId);
    }
  }
}

export default ServiceController;
