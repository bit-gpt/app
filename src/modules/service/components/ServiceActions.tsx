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
import {
  AUDIO_TO_TEXT_ID,
  CHAT_ID,
  DIFFUSER_ID,
  TEXT_TO_AUDIO_ID,
  UPSCALER_ID,
} from "shared/helpers/utils";

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
      if (interfaces.some((app) => app.id === CHAT_ID)) {
        navigate(`/prem-chat/${serviceId}`);
      } else if (interfaces.some((app) => app.id === DIFFUSER_ID)) {
        navigate(`/prem-image/${serviceId}`);
      } else if (interfaces.some((app) => app.id === AUDIO_TO_TEXT_ID)) {
        navigate(`/prem-audio/${serviceId}`);
      } else if (interfaces.some((app) => app.id === TEXT_TO_AUDIO_ID)) {
        navigate(`/prem-text-audio/${serviceId}`);
      } else if (interfaces.some((app) => app.id === UPSCALER_ID)) {
        navigate(`/prem-upscaler/${serviceId}`);
      }
      return;
    }
    setIsOpen(true);
  }, []);

  const documentation = `${interfaces[0]?.documentation || ""}`.trim();

  const memoryInGib = round(memoryRequirements / 1024, 2);

  return (
    <>
      <div className="flex flex-wrap items-center md:gap-4 gap-3 ml-auto">
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

        {["not_supported", "not_enough_memory", "not_enough_system_memory", "coming_soon"].includes(
          status
        ) && <WarningServiceState status={status} memoryRequirements={memoryInGib} />}
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
