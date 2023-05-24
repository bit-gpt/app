import { useCallback, useState } from "react";
import WarningIcon from "shared/components/WarningIcon";
import WarningModal from "./WarningModal";

const WarningState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeWarningModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        <WarningIcon />
      </button>
      {isOpen && (
        <WarningModal onCancel={closeWarningModal} onOk={closeWarningModal} />
      )}
    </>
  );
};

export default WarningState;
