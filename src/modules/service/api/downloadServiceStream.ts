import { DownloadMessage } from "../types";
import { getBackendUrlFromStore } from "shared/store/setting";

let eventSource: EventSource;
const instantiateEventSource = (backendUrl: string, serviceId: string) => {
  if (eventSource) {
    return eventSource;
  } else {
    eventSource = new EventSource(`${backendUrl}v1/download-service-stream-sse/${serviceId}`);
  }
};

const downloadServiceStream = async (
  serviceId: string,
  onError: (err: any) => void,
  onMessage: (message: DownloadMessage) => void,
  onceCompleted: () => void
): Promise<void> => {
  const backendUrl = new URL(getBackendUrlFromStore());
  try {
    instantiateEventSource(backendUrl.toString(), serviceId);
    eventSource.onmessage = (event) => {
      if (!event.data) return;
      try {
        const parsedData = JSON.parse(event.data);
        const status = parsedData.status;
        if (status.includes("Digest:")) {
          eventSource.close();
          onceCompleted();
          return;
        }
        onMessage(parsedData);
      } catch (error) {
        throw error;
      }
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
