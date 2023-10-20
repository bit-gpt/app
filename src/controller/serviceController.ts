import type { Service } from "../modules/service/types";

import BinariesController from "./binariesController";
import DockerController from "./dockerController";

export type DownloadArgs = {
  serviceId: string;
  binariesUrl?: Record<string, string | null>;
  weightsDirectoryUrl?: string;
  weightsFiles?: string[];
  afterSuccess?: () => void;
};

interface IServiceController {
  start(serviceId: string, serviceType: Service["serviceType"]): Promise<void>;
  stop(serviceId: string, serviceType: Service["serviceType"]): Promise<void>;
  restart(serviceId: string, serviceType: Service["serviceType"]): Promise<void>;
  delete(serviceId: string, serviceType: Service["serviceType"]): Promise<void>;
  download({
    serviceId,
    weightsDirectoryUrl,
    weightsFiles,
    serviceType,
    afterSuccess,
  }: DownloadArgs & { serviceType: string }): Promise<void>;
  getService(serviceId: string, serviceType: Service["serviceType"]): Promise<Service>;
  getServices(serviceType: Service["serviceType"]): Promise<Service[]>;
  getLogs(serviceId: string, serviceType: Service["serviceType"]): Promise<string>;
  getServiceStats(serviceId: string, serviceType: Service["serviceType"]): Promise<any>;
  getSystemStats(serviceType: Service["serviceType"]): Promise<any>;
  getGPUStats(serviceType: Service["serviceType"]): Promise<any>;
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
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      await this.dockerController.start(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.start(serviceId);
    }
  }

  async stop(serviceId: string, serviceType: string): Promise<void> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      await this.dockerController.stop(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.stop(serviceId);
    }
  }

  async restart(serviceId: string, serviceType: string): Promise<void> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      await this.dockerController.restart(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.restart(serviceId);
    }
  }

  async delete(serviceId: string, serviceType: string): Promise<void> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      await this.dockerController.delete(serviceId);
    } else if (serviceType === "binary") {
      await this.binariesController.delete(serviceId);
    }
  }

  async download({
    serviceId,
    binariesUrl,
    weightsDirectoryUrl,
    weightsFiles,
    serviceType,
    afterSuccess,
  }: DownloadArgs & { serviceType: string }): Promise<void> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      await this.dockerController.download({ serviceId, afterSuccess });
    } else if (serviceType === "binary") {
      await this.binariesController.download({
        serviceId,
        binariesUrl,
        weightsDirectoryUrl,
        weightsFiles,
        afterSuccess,
      });
    }
  }

  async getService(serviceId: string, serviceType: string): Promise<Service> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
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

  async getLogs(serviceId: string, serviceType: Service["serviceType"]): Promise<string> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      return await this.dockerController.getLogs(serviceId);
    } else if (serviceType === "binary") {
      return await this.binariesController.getLogs(serviceId);
    } else {
      return "";
    }
  }

  async getServiceStats(
    serviceId: string,
    serviceType: Service["serviceType"],
  ): Promise<Record<string, string>> {
    // If serviceType is not provided, we assume it's docker
    serviceType = serviceType ? serviceType : "docker";
    if (serviceType === "docker") {
      return await this.dockerController.getServiceStats(serviceId);
    } else if (serviceType === "binary") {
      return await this.binariesController.getServiceStats(serviceId);
    } else {
      return {};
    }
  }

  async getSystemStats(serviceType: Service["serviceType"]): Promise<any> {
    // We check the env (browser or desktop) to determine serviceType
    if (serviceType === "docker") {
      return await this.dockerController.getSystemStats();
    } else if (serviceType === "binary") {
      return await this.binariesController.getSystemStats();
    }
  }

  async getGPUStats(serviceType: Service["serviceType"]): Promise<any> {
    // We check the env (browser or desktop) to determine serviceType
    if (serviceType === "docker") {
      return await this.dockerController.getGPUStats();
    } else if (serviceType === "binary") {
      return await this.binariesController.getGPUStats();
    }
  }
}

export default ServiceController;
