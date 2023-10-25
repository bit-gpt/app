import DownloadIcon from "shared/components/DownloadIcon";
import Spinner from "shared/components/Spinner";

import { isServiceBinary } from "../../../shared/helpers/utils";
import useDownloadServiceStream from "../../../shared/hooks/useDownloadServiceStream";
import useSettingStore from "../../../shared/store/setting";
import type { ServiceStateProps } from "../types";

const NotDownloadedServiceState = ({ service, refetch, progress }: ServiceStateProps) => {
  const { mutate: download } = useDownloadServiceStream();
  const onDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    download({
      serviceId: service.id,
      binariesUrl: isServiceBinary(service) ? service.binariesUrl : undefined,
      weightsDirectoryUrl: isServiceBinary(service) ? service.weightsDirectoryUrl : undefined,
      weightsFiles: isServiceBinary(service) ? service.weightsFiles : undefined,
      serviceType: service.serviceType,
      afterSuccess: () => {
        useSettingStore.getState().removeServiceDownloadInProgress(service.id);
        refetch();
      },
    });
  };

  if (progress !== undefined) {
    return (
      <>
        <p className="text-grey-300">{progress}%</p>
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
