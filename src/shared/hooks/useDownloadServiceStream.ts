import downloadServiceStream from "modules/service/api/downloadServiceStream";
import { useCallback, useRef, useState } from "react";

const useDownloadServiceStream = () => {
  const [progresses, setProgress] = useState<Record<string, number>>(() => ({}));
  const progressesRef = useRef<Record<string, number>>({});

  const download = useCallback((serviceId: string, afterSuccess?: () => void) => {
    downloadServiceStream(
      serviceId,
      (error) => {
        console.log(error);
      },
      (message) => {
        console.log(message.status);
        progressesRef.current = { ...progressesRef.current, [serviceId]: message.percentage };
        if ("percentage" in message) setProgress(progressesRef.current);
      },
      () => {
        setProgress({ ...progresses, [serviceId]: -1 });
        afterSuccess && afterSuccess();
      }
    );
  }, []);

  return { progresses: progressesRef.current, download };
};

export default useDownloadServiceStream;
