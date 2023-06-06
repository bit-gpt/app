import downloadServiceStream from "modules/service/api/downloadServiceStream";
import { useCallback, useState } from "react";

const useDownloadServiceStream = () => {
  const [progress, setProgress] = useState(-1);
  const download = useCallback((serviceId: string, afterSuccess?: () => void) => {
    downloadServiceStream(
      serviceId,
      (error) => {
        console.log(error);
      },
      (message) => {
        console.log(message.status);
        if ("percentage" in message) setProgress(message.percentage as number);
      },
      () => {
        setProgress(-1);
        afterSuccess && afterSuccess();
      }
    );
  }, []);

  return { progress, download };
};

export default useDownloadServiceStream;
