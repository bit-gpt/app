import { useCallback, useState } from "react";
import { ServiceActionsProps } from "../types";
import NotDownloadedServiceState from "./NotDownloadedServiceState";
import RunningServiceState from "./RunningServiceState";
import StoppedServiceState from "./StoppedServiceState";
import WarningServiceState from "./WarningServiceState";
import { useNavigate } from "react-router-dom";
import DocumentationModal from "./DocumentationModal";
import NeedsUpdateServiceState from "./NeedsUpdateServiceState";
import { round } from "lodash";

const ServiceActions = ({
  status,
  serviceId,
  refetch,
  children,
  isDetailView = false,
  interfaces,
  needsUpdate,
  memoryRequirements,
}: ServiceActionsProps) => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);

  const onOpenClick = useCallback(() => {
    const isPlayground = interfaces.some((app) => app.playground);
    if (isPlayground) {
      navigate(`/prem-chat/${serviceId}`);
      return;
    }
    setIsOpen(true);
  }, []);

  const documentation = `${interfaces[0]?.documentation || ""}`.trim();

  const memoryInGib = round(memoryRequirements / 1024, 2);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 ml-auto">
        {children}
        {isDetailView && needsUpdate && (
          <NeedsUpdateServiceState serviceId={serviceId} refetch={refetch} />
        )}
        {status === "running" && (
          <RunningServiceState
            serviceId={serviceId}
            refetch={refetch}
            isDetailView={isDetailView}
            onOpenClick={onOpenClick}
          />
        )}
        {status === "stopped" && (
          <StoppedServiceState
            serviceId={serviceId}
            refetch={refetch}
            isDetailView={isDetailView}
            onOpenClick={onOpenClick}
          />
        )}

        {status === "not_downloaded" && (
          <NotDownloadedServiceState serviceId={serviceId} refetch={refetch} />
        )}

        {["not_supported", "not_enough_memory", "not_enough_system_memory", "coming_soon"].includes(status) && (
          <WarningServiceState status={status} memoryRequirements={memoryInGib} />
        )}
      </div>
      {modalIsOpen && (
        <DocumentationModal
          content={documentation}
          isOpen={modalIsOpen}
          closeModal={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ServiceActions;
