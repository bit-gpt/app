import DownloadIcon from "shared/components/DownloadIcon";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import downloadServiceStream from "../api/downloadServiceStream";
import { useState } from "react";

const NotDownloadedServiceState = ({
  serviceId,
  refetch,
}: ServiceStateProps) => {

  const [progress, setProgress] = useState(-1);

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    downloadServiceStream(
      serviceId,
      (error) => {
        console.log(error);
      },
      (message) => {
        if ('progress' in message)
          setProgress(message.progress as number);
      },
    );
  };

  if (progress >= 0) {
    return (
      <>
        <p>{progress}%</p>
        <Spinner className="w-5 h-5" />
      </>
    )
  }

  return (
    <button onClick={onDownload}>
      <DownloadIcon />
    </button>
  );
};

export default NotDownloadedServiceState;
