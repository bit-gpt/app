import DownloadIcon from "shared/components/DownloadIcon";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import useSettingStore from "../../../shared/store/setting";

const NotDownloadedServiceState = ({
  serviceId,
  refetch,
  progress,
  download,
}: ServiceStateProps) => {
  const addServiceDownloadInProgress = useSettingStore(
    (state) => state.addServiceDownloadInProgress
  );

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    download?.(serviceId, refetch);
    addServiceDownloadInProgress(serviceId);
  };

  if (progress && progress >= 0) {
    return (
      <>
        <p className="text-brightgray">{progress}%</p>
        <div className="flex justify-center">
          <Spinner className="h-5 w-5" />
        </div>
      </>
    );
  }

  return (
    <button onClick={onDownload}>
      <DownloadIcon />
    </button>
  );
};

export default NotDownloadedServiceState;
