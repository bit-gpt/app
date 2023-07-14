import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import RefreshIcon from "shared/components/RefreshIcon";
import useDownloadServiceStream from "shared/hooks/useDownloadServiceStream";
import useStartService from "shared/hooks/useStartService";
import useStopService from "shared/hooks/useStopService";
import { Tooltip } from "react-tooltip";

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
        <div className="flex justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      </>
    );
  }

  return (
    <>
      <button className="refresh-icon md:mx-4" onClick={onDownload}>
        <RefreshIcon />
      </button>
      <Tooltip anchorSelect=".refresh-icon" place="bottom" className="topltip">
        There is a new version available for this service. Updating will dowload the new version and
        restart your service, causing a brief downtime.
      </Tooltip>
    </>
  );
};

export default NeedsUpdateServiceState;
