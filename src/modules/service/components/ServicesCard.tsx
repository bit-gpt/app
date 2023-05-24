import { ServicesCardProps } from "shared/types";
import DeleteIcon from "../../../shared/components/DeleteIcon";
import StopIcon from "../../../shared/components/StopIcon";
import PlayIcon from "../../../shared/components/PlayIcon";
import WarningState from "modules/service/components/WarningState";
import DownloadIcon from "../../../shared/components/DownloadIcon";
import { useMutation } from "@tanstack/react-query";
import downloadService from "modules/service/api/downloadService";

const ServicesCard = ({
  title,
  className,
  icon,
  status,
  serviceId,
}: ServicesCardProps) => {
  const { mutate: downloadMutate, isLoading: downloadLoading } = useMutation(() =>
    downloadService(serviceId)
  );

  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onStop");
  };

  const onStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onStart");
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("onDelete");
  };

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    downloadMutate();
    console.log("onDownload");
  };

  return (
    <div className={className}>
      <div className="flex gap-8 items-start flex-wrap w-full relative">
        <div className="dashboard-bottom__card-box">
          <img src={icon} alt="icon" />
        </div>
        <div className="flex gap-4 md:ml-auto">
          {status === "running" && (
            <>
              <button className="border-[0.5px] border-brightgray rounded-[3px] py-1 px-3 text-[10px] font-proximaNova-regular">
                Running
              </button>
              <button onClick={onStop}>
                <StopIcon />
              </button>
            </>
          )}
          {status === "stopped" && (
            <>
              <button onClick={onStart}>
                <PlayIcon />
              </button>
              <button onClick={onDelete}>
                <DeleteIcon />
              </button>
            </>
          )}

          {status === "not_downloaded" && (
            <>
            {
              downloadLoading ? <span className="text-[10px] font-proximaNova-regular">Downloading...</span> :
              <button onClick={onDownload}>
              <DownloadIcon />
            </button>
            }
            </>
          )}

          {(status === "available_memory_less_than_container" ||
            status === "system_memory_less_than_container") && <WarningState />}
        </div>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default ServicesCard;
