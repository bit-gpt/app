import downloadServiceStream from "modules/service/api/downloadServiceStream";

import useSettingStore from "../store/setting";

const useDownloadServiceStream = () => {
  const setServiceDownloadProgress = useSettingStore((state) => state.setServiceDownloadProgress);
  const removeServiceDownloadInProgress = useSettingStore(
    (state) => state.removeServiceDownloadInProgress,
  );
  const serviceDownloadsInProgress = useSettingStore((state) => state.serviceDownloadsInProgress);

  const download = async (serviceId: string, afterSuccess?: () => void) => {
    await downloadServiceStream(
      serviceId,
      (error) => {
        console.log("ERROR serviceId:", serviceId);
        console.error(error);
        removeServiceDownloadInProgress(serviceId);
      },
      (message) => {
        console.log(`${serviceId}: ${message.status} - ${message.percentage}`);
        if ("percentage" in message) {
          setServiceDownloadProgress(serviceId, message.percentage);
        }
      },
      () => {
        console.log(`${serviceId} download completed`);
        afterSuccess?.();
      },
    );
  };

  return { progresses: serviceDownloadsInProgress, download };
};

export default useDownloadServiceStream;
