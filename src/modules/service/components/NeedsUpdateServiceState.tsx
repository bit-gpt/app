import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import RefreshIcon from "shared/components/RefreshIcon";
import useDownloadServiceStream from "shared/hooks/useDownloadServiceStream";
import useStartService from "shared/hooks/useStartService";
import useStopService from "shared/hooks/useStopService";

const NeedsUpdateServiceState = ({ serviceId, refetch }: ServiceStateProps) => {
  const { progress, download } = useDownloadServiceStream();
  const { mutateAsync: startService, isLoading: isStartServiceLoading } = useStartService();
  const { mutateAsync: stopService, isLoading: isStopServiceLoading } = useStopService();

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    download(serviceId, async () => {
      await stopService(serviceId);
      await startService(serviceId);
      refetch();
    });
  };

  if (progress >= 0 || isStartServiceLoading || isStopServiceLoading) {
    return (
      <>
        {progress > 0 && <p className="text-brightgray">{progress}%</p>}
        <div className="flex justify-center mt-5">
          <Spinner className="h-10 w-10" />
        </div>
      </>
    );
  }

  return (
    <button onClick={onDownload}>
      <RefreshIcon />
    </button>
  );
};

export default NeedsUpdateServiceState;
