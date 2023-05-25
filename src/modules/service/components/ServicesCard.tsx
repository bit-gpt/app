import { ServicesCardProps } from "shared/types";
import NotDownloadedServiceState from "./NotDownloadedServiceState";
import RunningServiceState from "./RunningServiceState";
import StoppedServiceState from "./StoppedServiceState";
import WarningServiceState from "./WarningServiceState";
import { Link } from "react-router-dom";

const ServicesCard = ({
  title,
  className,
  icon,
  status,
  serviceId,
}: ServicesCardProps) => {
  return (
    <Link to={`/services/${serviceId}/detail`} className={className}>
      <div className="flex gap-8 items-start flex-wrap w-full relative">
        <div className="dashboard-bottom__card-box">
          <img src={icon} alt="icon" />
        </div>
        <div className="flex gap-4 md:ml-auto">
          {status === "running" && (
            <RunningServiceState serviceId={serviceId} />
          )}
          {status === "stopped" && (
            <StoppedServiceState serviceId={serviceId} />
          )}

          {status === "not_downloaded" && (
            <NotDownloadedServiceState serviceId={serviceId} />
          )}

          {(status === "available_memory_less_than_container" ||
            status === "system_memory_less_than_container") && (
            <WarningServiceState />
          )}
        </div>
      </div>
      <h3>{title}</h3>
    </Link>
  );
};

export default ServicesCard;
