import type { Registry } from "modules/settings/types";

import downloadServiceStream from "../modules/service/api/downloadServiceStream";
import type { Service, ServiceDocker } from "../modules/service/types";
import api from "../shared/api/v1";
import type { Interface } from "../shared/helpers/interfaces";
import useSettingStore from "../shared/store/setting";

import AbstractServiceController from "./abstractServiceController";

class DockerController extends AbstractServiceController {
  async start(serviceId: string): Promise<void> {
    await api().post(`v1/run-service/`, { id: serviceId });
  }

  async restart(serviceId: string): Promise<void> {
    await api().get(`v1/restart-service/${serviceId}`);
  }

  async stop(serviceId: string): Promise<void> {
    await api().get(`v1/stop-service/${serviceId}`);
  }

  async delete(serviceId: string): Promise<void> {
    await api().get(`v1/remove-service/${serviceId}`);
  }

  async download({
    serviceId,
    afterSuccess,
  }: {
    serviceId: string;
    afterSuccess?: () => void;
  }): Promise<void> {
    console.log(`Downloading service ${serviceId}`);
    useSettingStore.getState().setServiceDownloadProgress(serviceId, "docker", 0);
    await downloadServiceStream(
      serviceId,
      (error) => {
        console.log("ERROR serviceId:", serviceId);
        console.error(error);
        useSettingStore.getState().removeServiceDownloadInProgress(serviceId);
        useSettingStore.getState().removeServiceAsDownloading(serviceId);
      },
      (message) => {
        console.log(`${serviceId}: ${message.status} - ${message.percentage}`);
        if ("percentage" in message) {
          useSettingStore
            .getState()
            .setServiceDownloadProgress(serviceId, "docker", message.percentage);
        }
      },
      () => {
        console.log(`${serviceId} download completed`);
        useSettingStore.getState().removeServiceDownloadInProgress(serviceId);
        useSettingStore.getState().removeServiceAsDownloading(serviceId);
        afterSuccess?.();
      },
    );
  }

  async getService(serviceId: string): Promise<ServiceDocker> {
    const response = await api().get(`v1/services/${serviceId}`);
    return response.data;
  }

  async getServices(): Promise<ServiceDocker[]> {
    const response = await api().get("v1/services/");
    return response.data;
  }

  async getLogs(serviceId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async getServiceStats(serviceId: string): Promise<Record<string, string>> {
    const response = await api().get(`v1/stats/${serviceId}`);
    return response.data;
  }

  async getSystemStats(): Promise<Record<string, string>> {
    const response = await api().get("v1/stats-all/");
    return response.data;
  }

  async getGPUStats(): Promise<Record<string, string>> {
    const response = await api().get("v1/gpu-stats-all/");
    return response.data;
  }

  async getInterfaces(): Promise<Interface[]> {
    const response = await api().get("v1/interfaces/");
    return response.data;
  }

  async addService(service: Service): Promise<void> {
    await api().post("v1/services/", service);
  }

  async addRegistry(registry: Registry): Promise<void> {
    await api().post(`v1/registries/`, registry);
  }

  async deleteRegistry(registry: Registry): Promise<void> {
    await api().delete(`v1/registries/?url=${registry.url}`);
  }

  async fetchRegistries(): Promise<Registry[]> {
    const response = await api().get(`v1/registries/`);
    return response.data;
  }

  async resetDefaultRegistry(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default DockerController;
