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
import { AUDIO_TO_TEXT_ID, CHAT_ID, DIFFUSER_ID } from "shared/helpers/utils";
import ServiceDropdown from "./ServiceDropdown";
import cross from "assets/images/dot.svg";
import clsx from "clsx";
import useStopService from "shared/hooks/useStopService";
import { toast } from "react-toastify";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const onOpenClick = useCallback(() => {
    const isPlayground = interfaces.some((app) => app.playground);
    if (isPlayground) {
      if (interfaces.some((app) => app.id === CHAT_ID)) {
        navigate(`/prem-chat/${serviceId}`);
      } else if (interfaces.some((app) => app.id === DIFFUSER_ID)) {
        navigate(`/prem-image/${serviceId}`);
      } else if (interfaces.some((app) => app.id === AUDIO_TO_TEXT_ID)) {
        navigate(`/prem-audio/${serviceId}`);
      }
      return;
    }
    setIsOpen(true);
  }, []);
  const { mutate, isLoading } = useStopService();
  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate(serviceId, {
      onSuccess: () => {
        refetch();
        toast.success("Service stopped successfully");
      },
      onError: () => {
        toast.error("Failed to stop service");
      },
    });
  };

  const documentation = `${interfaces[0]?.documentation || ""}`.trim();

  const memoryInGib = round(memoryRequirements / 1024, 2);

  const isInAccessible = [
    "not_supported",
    "not_enough_memory",
    "not_enough_system_memory",
    "coming_soon",
  ].includes(status);

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

        {isInAccessible && <WarningServiceState status={status} memoryRequirements={memoryInGib} />}

        {isDetailView && !isInAccessible && status !== "not_downloaded" && (
          <>
            <button
              className={clsx({ "red-badge": needsUpdate })}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img src={cross} alt="cross" width={22} height={22} className="w-6 h-6" />
            </button>
            <ul className={clsx("dropdown-menu", { "dropdown-active": dropdownOpen })}>
              {status === "running" && isDetailView && (
                <li>
                  <button onClick={onStop}>Stop</button>{" "}
                </li>
              )}

              {status === "stopped" && <li>Delete</li>}
              {needsUpdate && <li className="red-badge">Update</li>}
            </ul>
          </>
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
