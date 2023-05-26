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

      {[
        "not_supported",
        "service_greater_than_free_memory",
        "service_greater_than_limit_memory",
      ].includes(status) && <WarningServiceState status={status} />}
    </div>
  );
};

export default ServiceActions;
