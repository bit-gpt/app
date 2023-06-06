import { useCallback, useState } from "react";
import WarningIcon from "shared/components/WarningIcon";
import WarningModal from "./WarningModal";
import { ServiceStatus, WarningServiceStateProps } from "../types";
import WarningShapeIcon from "shared/components/WarningShapeIcon";

const WarningServiceState = ({ status }: WarningServiceStateProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeWarningModal = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsOpen(false);
  }, []);

  const getServiceWarningDescription = (status: ServiceStatus) => {
    switch (status) {
      case "not_supported":
        return "This service is not supported on your device";
      case "service_greater_than_free_memory":
        return "You don't have enough memory to run this service, stop another service in order to run it";
      case "service_greater_than_limit_memory":
        return "In order to run this service, you need at least 100gb of RAM Memory";
      default:
        return "";
    }
  };

  const getServiceWarningIcon = (status: ServiceStatus) => {
    switch (status) {
      case "service_greater_than_free_memory":
        return <WarningShapeIcon />;
      case "not_supported":
      case "service_greater_than_limit_memory":
        return <WarningIcon />;
      default:
        return <WarningIcon />;
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <WarningIcon />
      </button>
      {isOpen && (
        <WarningModal
          description={getServiceWarningDescription(status)}
          onCancel={closeWarningModal}
          onOk={closeWarningModal}
          icon={getServiceWarningIcon(status)}
          isOpen={isOpen}
        />
      )}
    </>
  );
};

export default WarningServiceState;
