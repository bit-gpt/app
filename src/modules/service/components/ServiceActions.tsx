import { useCallback, useState } from "react";
import { ServiceActionsProps } from "../types";
import NotDownloadedServiceState from "./NotDownloadedServiceState";
import RunningServiceState from "./RunningServiceState";
import StoppedServiceState from "./StoppedServiceState";
import WarningServiceState from "./WarningServiceState";
import { useNavigate } from "react-router-dom";
import DocumentationModal from "./DocumentationModal";

const ServiceActions = ({
  status,
  serviceId,
  refetch,
  children,
  isDetailView = false,
  interfaces,
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

  return (
    <>
      <div className="flex items-center gap-4 ml-auto">
        {children}
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

        {[
          "not_supported",
          "service_greater_than_free_memory",
          "service_greater_than_limit_memory",
        ].includes(status) && <WarningServiceState status={status} />}
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
