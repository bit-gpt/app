import React from "react";
import WarningIcon from "shared/components/WarningIcon";
import WarningShapeIcon from "shared/components/WarningShapeIcon";

import type { ServiceStatus, WarningServiceStateProps } from "../types";

import WarningModal from "./WarningModal";

const WarningServiceState = ({
  status,
  memoryRequirements,
  closeWarningModal,
  isWarningModalOpen,
}: WarningServiceStateProps) => {
  const getServiceWarningDescription = (status: ServiceStatus) => {
    switch (status) {
      case "docker_only":
        return "This model is only available on Prem Server installation";
      case "coming_soon":
        return "Service will be available soon";
      case "not_supported":
        return "This service is not supported on your device";
      case "not_enough_memory":
        return "You don't have enough memory to run this service, stop another service in order to run it";
      case "not_enough_system_memory":
        return `In order to run this service, you need at least ${memoryRequirements}GiB of RAM Memory`;
      default:
        return "";
    }
  };

  const getServiceWarningIcon = (status: ServiceStatus) => {
    switch (status) {
      case "not_enough_memory":
        return <WarningShapeIcon />;
      case "docker_only":
      case "not_supported":
      case "not_enough_system_memory":
        return <WarningIcon className="warning-icon" />;
      default:
        return <WarningIcon className="warning-icon" />;
    }
  };

  const title = status === "coming_soon" ? "Coming soon" : "Warning";

  return (
    <>
      <WarningIcon />
      {isWarningModalOpen && (
        <WarningModal
          description={getServiceWarningDescription(status)}
          onCancel={closeWarningModal}
          onOk={closeWarningModal}
          icon={getServiceWarningIcon(status)}
          isOpen={isWarningModalOpen}
          title={title}
        />
      )}
    </>
  );
};

export default WarningServiceState;
