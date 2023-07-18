import { useCallback, useRef, useState } from "react";
import { ServiceActionsProps } from "../types";
import NotDownloadedServiceState from "./NotDownloadedServiceState";
import RunningServiceState from "./RunningServiceState";
import StoppedServiceState from "./StoppedServiceState";
import WarningServiceState from "./WarningServiceState";
import { useNavigate } from "react-router-dom";
import DocumentationModal from "./DocumentationModal";
import { round } from "lodash";
import { AUDIO_TO_TEXT_ID, CHAT_ID, DIFFUSER_ID, TEXT_TO_AUDIO_ID } from "shared/helpers/utils";
import cross from "assets/images/dot.svg";
import clsx from "clsx";
import useStopService from "shared/hooks/useStopService";
import { toast } from "react-toastify";
import useBodyLock from "shared/hooks/useBodyLock";
import Spinner from "shared/components/Spinner";
import { useOnClickOutside } from "usehooks-ts";
import useDownloadServiceStream from "shared/hooks/useDownloadServiceStream";
import useStartService from "shared/hooks/useStartService";
import { Tooltip } from "react-tooltip";

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
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { setBodyLocked } = useBodyLock();
  const { mutate, isLoading } = useStopService();
  const { progress, download } = useDownloadServiceStream();
  const { mutateAsync: startService, isLoading: isStartServiceLoading } = useStartService();
  const { mutateAsync: stopService, isLoading: isStopServiceLoading } = useStopService();
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

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
      }
      return;
    }
    setIsOpen(true);
  }, []);

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

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(true);
    setBodyLocked(true);
  };

  const onUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    download(serviceId, async () => {
      await stopService(serviceId);
      await startService(serviceId);
      refetch();
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

  if (isLoading) {
    return (
      <div className="mt-2">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

  if (progress >= 0 || isStartServiceLoading || isStopServiceLoading) {
    return (
      <>
        {progress > 0 && <p className="text-brightgray">{progress}%</p>}
        <div className="flex justify-center">
          <Spinner className="md:h-10 md:w-10 h-5 w-5" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center md:gap-4 gap-3 ml-auto">
        {children}
        {status === "running" && <RunningServiceState onOpenClick={onOpenClick} />}
        {status === "stopped" && (
          <StoppedServiceState
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setBodyLocked={setBodyLocked}
            serviceId={serviceId}
            refetch={refetch}
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
              ref={dropdownRef}
              onClick={() => setDropdownOpen(true)}
              className={clsx({ "red-badge": needsUpdate })}
            >
              <img src={cross} alt="cross" width={22} height={22} className="w-6 h-6" />
            </button>
            <ul className={clsx("dropdown-menu", { "dropdown-active": dropdownOpen })}>
              {status === "running" && isDetailView && (
                <li>
                  <button onClick={onStop}>Stop</button>
                </li>
              )}
              {status === "stopped" && (
                <li>
                  <button onClick={onDelete}>Delete</button>
                </li>
              )}
              {isDetailView && needsUpdate && (
                <>
                  <li className="red-badge">
                    <button className="refresh-icon" onClick={onUpdate}>
                      Update
                    </button>
                  </li>
                  <div className="relative">
                    <Tooltip
                      anchorSelect=".refresh-icon"
                      place="left"
                      className="topltip text-center md:max-w-[246px] ml-[-20px] max-md:max-w-[170px] !bg-[#353539]"
                    >
                      it will download the latest version, stop the service and run it again.
                    </Tooltip>
                  </div>
                </>
              )}
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
