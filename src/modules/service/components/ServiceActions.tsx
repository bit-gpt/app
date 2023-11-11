import cross from "assets/images/dot.svg";
import clsx from "clsx";
import { round } from "lodash";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Spinner from "shared/components/Spinner";
import {
  AUDIO_TO_TEXT_ID,
  CHAT_ID,
  checkIfAccessible,
  CODER_ID,
  DIFFUSER_ID,
  isServiceBinary,
  TEXT_TO_AUDIO_ID,
  UPSCALER_ID,
} from "shared/helpers/utils";
import useDownloadServiceStream from "shared/hooks/useDownloadServiceStream";
import useRestartService from "shared/hooks/useRestartService";
import useStopService from "shared/hooks/useStopService";
import { useLockedBody, useOnClickOutside } from "usehooks-ts";

import useSettingStore from "../../../shared/store/setting";
import type { ServiceActionsProps } from "../types";

import DocumentationModal from "./DocumentationModal";
import NotDownloadedServiceState from "./NotDownloadedServiceState";
import RunningServiceState from "./RunningServiceState";
import StoppedServiceState from "./StoppedServiceState";
import WarningServiceState from "./WarningServiceState";

const ServiceActions = ({
  status,
  service,
  refetch,
  children,
  isDetailView = false,
  interfaces,
  needsUpdate,
  memoryRequirements,
  closeWarningModal,
  isWarningModalOpen,
}: ServiceActionsProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setBodyLocked] = useLockedBody(false, "root");
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { mutate: download } = useDownloadServiceStream();
  const progresses = useSettingStore((state) => state.serviceDownloadsInProgress);
  const { mutate: stopService, isPending: isStopServicePending } = useStopService();
  const {
    mutate: restartService,
    mutateAsync: restartServiceAsync,
    isPending: isRestartServicePending,
  } = useRestartService();
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));

  const onOpenClick = useCallback(() => {
    const isPlayground = interfaces.some((app) => app.playground);
    if (isPlayground) {
      if (interfaces.some((app) => app.id === CHAT_ID)) {
        navigate(`/prem-chat/${service.id}/${service.serviceType ?? "docker"}`);
      } else if (interfaces.some((app) => app.id === DIFFUSER_ID)) {
        navigate(`/prem-image/${service.id}/${service.serviceType ?? "docker"}`);
      } else if (interfaces.some((app) => app.id === AUDIO_TO_TEXT_ID)) {
        navigate(`/prem-audio/${service.id}/${service.serviceType ?? "docker"}`);
      } else if (interfaces.some((app) => app.id === TEXT_TO_AUDIO_ID)) {
        navigate(`/prem-text-audio/${service.id}/${service.serviceType ?? "docker"}`);
      } else if (interfaces.some((app) => app.id === UPSCALER_ID)) {
        navigate(`/prem-upscaler/${service.id}/${service.serviceType ?? "docker"}`);
      } else if (interfaces.some((app) => app.id === CODER_ID)) {
        navigate(`/prem-coder/${service.id}/${service.serviceType ?? "docker"}`);
      }
      return;
    }
    setIsOpen(true);
  }, [interfaces, navigate, service.id, service.serviceType]);

  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    stopService(
      { serviceId: service.id, serviceType: service.serviceType },
      {
        onSuccess: () => {
          refetch();
          toast.success("Service stopped successfully");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to stop service");
          throw error;
        },
      },
    );
  };

  const onRestart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    restartService(
      { serviceId: service.id, serviceType: service.serviceType },
      {
        onSuccess: () => {
          refetch();
          toast.success("Service restarted successfully");
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to restart service");
          throw error;
        },
      },
    );
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(true);
    setBodyLocked(true);
  };

  const onUpdate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    download({
      serviceId: service.id,
      binariesUrl: isServiceBinary(service) ? service.binariesUrl : undefined,
      weightsDirectoryUrl: isServiceBinary(service) ? service.weightsDirectoryUrl : undefined,
      weightsFiles: isServiceBinary(service) ? service.weightsFiles : undefined,
      serviceType: service.serviceType,
      afterSuccess: async () => {
        refetch();
        await restartServiceAsync({ serviceId: service.id, serviceType: service.serviceType });
      },
    });
  };

  const documentation = `${interfaces[0]?.documentation || ""}`.trim();

  const memoryInGib = round(memoryRequirements / 1024, 2);

  const isAccessible = checkIfAccessible(status);

  if (isStopServicePending) {
    return (
      <div className="mt-2">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

  if (
    progresses[service.id]?.progress !== undefined ||
    isStopServicePending ||
    isRestartServicePending
  ) {
    return (
      <div className="flex">
        {progresses[service.id]?.progress !== undefined && (
          <p className="text-grey-300 mr-2">{progresses[service.id]?.progress}%</p>
        )}
        <div className="flex justify-center">
          <Spinner className="md:h-7 md:w-7 h-5 w-5" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center md:gap-4 gap-3 ml-auto">
        {children}
        {status === "running" && <RunningServiceState onOpenClick={onOpenClick} />}
        {status === "stopped" && (
          <StoppedServiceState
            service={service}
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            setBodyLocked={setBodyLocked}
            refetch={refetch}
            isDetailView={isDetailView}
            onOpenClick={onOpenClick}
          />
        )}

        {status === "not_downloaded" && (
          <NotDownloadedServiceState
            service={service}
            refetch={refetch}
            progress={progresses[service.id]?.progress}
          />
        )}

        {!isAccessible && (
          <WarningServiceState
            status={status}
            memoryRequirements={memoryInGib}
            closeWarningModal={closeWarningModal!}
            isWarningModalOpen={isWarningModalOpen!}
          />
        )}

        {isDetailView && isAccessible && status !== "not_downloaded" && (
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
                <>
                  <li>
                    <button onClick={onRestart}>Restart</button>
                  </li>
                  <li>
                    <button onClick={onStop}>Stop</button>
                  </li>
                </>
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
