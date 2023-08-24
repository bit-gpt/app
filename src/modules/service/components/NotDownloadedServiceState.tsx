import DownloadIcon from "shared/components/DownloadIcon";
import Spinner from "shared/components/Spinner";

import useDownloadServiceStream from "../../../shared/hooks/useDownloadServiceStream";
import useSettingStore from "../../../shared/store/setting";
import type { ServiceStateProps } from "../types";

const NotDownloadedServiceState = ({ serviceId, refetch }: ServiceStateProps) => {
  const { progresses, download } = useDownloadServiceStream();
  const addServiceDownloadInProgress = useSettingStore(
    (state) => state.addServiceDownloadInProgress,
  );
  const onDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await download?.(serviceId, refetch);
    addServiceDownloadInProgress(serviceId);
  };

  if (progresses[serviceId] >= 0) {
    return (
      <>
        <p className="text-grey-300">{progresses[serviceId]}%</p>
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
