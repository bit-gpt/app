import { ServiceActionsProps } from "../types";
import NotDownloadedServiceState from "./NotDownloadedServiceState";
import RunningServiceState from "./RunningServiceState";
import StoppedServiceState from "./StoppedServiceState";
import WarningServiceState from "./WarningServiceState";

const ServiceActions = ({
  status,
  serviceId,
  refetch,
  children,
}: ServiceActionsProps) => {
  return (
    <div className="flex gap-4 md:ml-auto">
      {children}
      {status === "running" && (
        <RunningServiceState serviceId={serviceId} refetch={refetch} />
      )}
      {status === "stopped" && (
        <StoppedServiceState serviceId={serviceId} refetch={refetch} />
      )}

      {status === "not_downloaded" && (
        <NotDownloadedServiceState serviceId={serviceId} refetch={refetch} />
      )}

      {(status === "available_memory_less_than_container" ||
        status === "system_memory_less_than_container") && (
        <WarningServiceState />
      )}
    </div>
  );
};

export default ServiceActions;
