import { invoke } from "@tauri-apps/api/tauri";

import type { Service, ServiceBinary } from "../modules/service/types";
import type { Interface } from "../shared/helpers/interfaces";
import interfaces from "../shared/helpers/interfaces";

import AbstractServiceController from "./abstractServiceController";

class BinariesController extends AbstractServiceController {
  async start(serviceId: string): Promise<void> {
    await invoke("start_service", { serviceId });
  }

  async restart(serviceId: string): Promise<void> {
    await this.stop(serviceId);
    const services: string[] = await invoke("get_running_services");
    while (!services.includes(serviceId)) {
      await this.start(serviceId);
    }
  }

  async stop(serviceId: string): Promise<void> {
    await invoke("stop_service", { serviceId });
  }

  async delete(serviceId: string): Promise<void> {
    await invoke("delete_service", { serviceId });
  }

  async download({
    serviceId,
    binariesUrl,
    weightsDirectoryUrl,
    weightsFiles,
    afterSuccess,
  }: {
    serviceId: string;
    binariesUrl?: Record<string, string | null>;
    weightsDirectoryUrl?: string;
    weightsFiles?: string[];
    afterSuccess?: () => void;
  }): Promise<void> {
    await invoke("download_service", {
      binariesUrl,
      weightsDirectoryUrl,
      weightsFiles,
      serviceId,
    });
    afterSuccess?.();
  }

  async getService(serviceId: string): Promise<ServiceBinary> {
    return await invoke<ServiceBinary>("get_service_by_id", { serviceId });
  }

  async getServices(): Promise<ServiceBinary[]> {
    return await invoke<ServiceBinary[]>("get_services");
  }

  async getLogs(serviceId: string): Promise<string> {
    return await invoke<string>("get_logs_for_service", { serviceId });
  }

  async getGPUStats(): Promise<Record<string, string>> {
    return await invoke<Record<string, string>>("get_gpu_stats");
  }

  async getServiceStats(serviceId: string): Promise<Record<string, string>> {
    return await invoke<Record<string, string>>("get_service_stats", { serviceId });
  }

  async getSystemStats(): Promise<Record<string, string>> {
    return await invoke<Record<string, string>>("get_system_stats");
  }

  async getInterfaces(): Promise<Interface[]> {
    return interfaces;
  }

  async addService(service: Service): Promise<void> {
    await invoke("add_service", { service });
  }
}

export default BinariesController;
