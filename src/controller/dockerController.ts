import downloadServiceStream from "../modules/service/api/downloadServiceStream";
import type { ServiceDocker } from "../modules/service/types";
import api from "../shared/api/v1";
import useSettingStore from "../shared/store/setting";

import AbstractServiceController from "./abstractServiceController";

class DockerController extends AbstractServiceController {
  async start(serviceId: string): Promise<void> {
    console.log(`Starting service ${serviceId}`);
    try {
      await api().post(`v1/run-service/`, { id: serviceId });
    } catch (e) {
      console.log(e);
    }
  }

  async restart(serviceId: string): Promise<void> {
    console.log(`Restarting service ${serviceId}`);
    try {
      await api().get(`v1/restart-service/${serviceId}`);
    } catch (e) {
      console.log(e);
    }
  }

  async stop(serviceId: string): Promise<void> {
    console.log(`Stopping service ${serviceId}`);
    try {
      await api().get(`v1/stop-service/${serviceId}`);
    } catch (e) {
      console.log(e);
    }
  }

  async delete(serviceId: string): Promise<void> {
    try {
      await api().get(`v1/remove-service/${serviceId}`);
    } catch (e) {
      console.error(`Failed to delete service ${serviceId}`);
    }
  }

  async download({
    serviceId,
    afterSuccess,
  }: {
    serviceId: string;
    afterSuccess?: () => void;
  }): Promise<void> {
    console.log(`Downloading service ${serviceId}`);
    await downloadServiceStream(
      serviceId,
      (error) => {
        console.log("ERROR serviceId:", serviceId);
        console.error(error);
        useSettingStore.getState().removeServiceDownloadInProgress(serviceId);
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
        afterSuccess?.();
      },
    );
  }

  async getService(serviceId: string): Promise<ServiceDocker> {
    try {
      const response = (await api().get(`v1/service/${serviceId}`)) ?? ({} as ServiceDocker);
      return response.data;
    } catch (e) {
      console.error(e);
      return {} as ServiceDocker;
    }
  }

  async getServices(): Promise<ServiceDocker[]> {
    try {
      const response = (await api().get("v1/services")) ?? [];
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async getLogs(serviceId: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  async getServiceStats(serviceId: string): Promise<Record<string, string>> {
    try {
      const response = await api().get(`v1/stats/${serviceId}`);
      return response.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async getSystemStats(): Promise<Record<string, string>> {
    try {
      const response = await api().get("v1/stats-all");
      return response.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  async getGPUStats(): Promise<Record<string, string>> {
    try {
      const response = await api().get("v1/gpu-stats-all");
      return response.data;
    } catch (e) {
      console.error(e);
      return {};
    }
  }
}

export default DockerController;
