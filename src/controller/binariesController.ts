import { invoke } from "@tauri-apps/api/tauri";

import type { ServiceBinary } from "../modules/service/types";

import AbstractServiceController from "./abstractServiceController";

class BinariesController extends AbstractServiceController {
  async start(serviceId: string): Promise<void> {
    console.log(`Starting service ${serviceId}`);
    try {
      await invoke("start_service", { serviceId });
    } catch (e) {
      console.log(e);
    }
  }

  async restart(serviceId: string): Promise<void> {
    console.log(`Restarting service ${serviceId}`);
    try {
      await this.stop(serviceId);
      const services: string[] = await invoke("get_running_services");
      while (!services.includes(serviceId)) {
        await this.start(serviceId);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async stop(serviceId: string): Promise<void> {
    console.log(`Stopping service ${serviceId}`);
    try {
      await invoke("stop_service", { serviceId });
    } catch (e) {
      console.log(e);
    }
  }

  async delete(serviceId: string): Promise<void> {
    console.log(`Deleting service ${serviceId}`);
    try {
      await invoke("delete_service", { serviceId });
    } catch (e) {
      console.log(e);
    }
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
    console.log(`Downloading service ${serviceId}`);
    try {
      await invoke("download_service", {
        binariesUrl,
        weightsDirectoryUrl,
        weightsFiles,
        serviceId,
      });
      afterSuccess?.();
    } catch (e) {
      console.log(e);
    }
  }

  async getService(serviceId: string): Promise<ServiceBinary | undefined> {
    try {
      return await invoke<ServiceBinary>("get_service_by_id", { serviceId });
    } catch (e) {
      console.log(e);
    }
  }

  async getServices(): Promise<ServiceBinary[] | undefined> {
    try {
      return await invoke<ServiceBinary[]>("get_services");
    } catch (e) {
      console.log(e);
    }
  }

  async getLogs(serviceId: string): Promise<string> {
    try {
      return await invoke<string>("get_logs_for_service", { serviceId });
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  async getGPUStats(): Promise<Record<string, string>> {
    try {
      return await invoke<Record<string, string>>("get_gpu_stats");
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  async getServiceStats(serviceId: string): Promise<Record<string, string>> {
    try {
      return await invoke<Record<string, string>>("get_service_stats", { serviceId });
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  async getSystemStats(): Promise<Record<string, string>> {
    try {
      return await invoke<Record<string, string>>("get_system_stats");
    } catch (e) {
      console.log(e);
      return {};
    }
  }
}

export default BinariesController;
