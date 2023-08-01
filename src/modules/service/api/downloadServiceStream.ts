import { getBackendUrlFromStore } from "shared/store/setting";

import type { DownloadMessage } from "../types";

const downloadServiceStream = async (
  serviceId: string,
  onError: (err: any) => void,
  onMessage: (message: DownloadMessage) => void,
  onceCompleted: () => void,
): Promise<void> => {
  const backendUrl = new URL(getBackendUrlFromStore());
  try {
    const eventSource = new EventSource(`${backendUrl}v1/download-service-stream-sse/${serviceId}`);
    eventSource.onmessage = (event) => {
      if (!event.data) return;
      const parsedData = JSON.parse(event.data);
      const status = parsedData.status;
      if (status.includes("Digest:")) {
        eventSource.close();
        onceCompleted();
        return;
      }
      onMessage(parsedData);
    };
    eventSource.onerror = (err: any) => {
      eventSource.close();
      onError(err);
    };
    eventSource.onopen = (evt) => {
      console.log("onopen", evt);
    };
  } catch (err) {
    console.log(err);
    onError(err);
  }
};

export default downloadServiceStream;
