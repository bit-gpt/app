import { useCallback, useState } from "react";
import WarningIcon from "shared/components/WarningIcon";
import WarningModal from "./WarningModal";

const WarningServiceState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeWarningModal = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsOpen(false);
    },
    []
  );

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
          description="You don't have enough memory to run this service, stop another
        service in order to run it"
          onCancel={closeWarningModal}
          onOk={closeWarningModal}
        />
      )}
    </>
  );
};

export default WarningServiceState;
