import { AxiosResponse } from "axios";
import api from "shared/api/v1";
import { DownloadMessage } from "../types";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { BACKEND_URL } from "shared/helpers/utils";

const downloadServiceStream = async (
  serviceId: string,
  onError: (err: any) => void,
  onMessage: (message: DownloadMessage) => void,
  onceCompleted: () => void,
): Promise<void> => {
  const backendUrl = new URL(BACKEND_URL);
  try {
    //const response = await api.get(`v1/download-service/${serviceId}`);
    //console.log(response);

    const eventSource = new EventSource(`${backendUrl}v1/download-service-stream-sse/${serviceId}`);
    eventSource.onmessage = (event) => {
      if (!event.data) return;
      try {
        const parsedData = JSON.parse(event.data);
        const status = parsedData.status;
        if (status.includes('Digest:')) {
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
      //evt.target?.addEventListener('message', (event) => { console.log('listener: message: ', event)})
      console.log('onopen', evt);
    };

/*     eventSource.onerror = (err: any) => {
      console.log('error', err.data);
    };
    eventSource.onopen = (evt) => {
      evt.target?.addEventListener('message', (event) => { console.log('listener: message: ', event)})
      console.log('onopen', evt);
    }; */
 

    /* fetchEventSource(`${backendUrl}v1/download-service-stream/${serviceId}`, {
      method: "GET",
      signal: ctrl.signal,
      onmessage: (event) => {
        console.log(event, event.data);
        const data = JSON.parse(event.data);
        onMessage(data);
      },
      onerror: (err: any) => {
        console.log(err);
        return onError(err);
      },
      onopen: (response: Response) => {
        console.log(response);
        console.log("stream opened");
        return Promise.resolve();
      }
    }); */
  } catch (err) {
    console.log(err);
    onError(err);
  }
}


export default downloadServiceStream;
