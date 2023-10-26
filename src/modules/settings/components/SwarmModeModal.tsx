import Modal from "react-modal";
import PrimaryButton from "shared/components/PrimaryButton";
import type { ModalProps } from "shared/types";

const SwarmModeModal = ({
  onOk,
  okButtonText = "Ok",
  isOpen,
  title = "Warning",
  description,
}: ModalProps) => {
  return (
    <Modal className="warning-modal" isOpen={isOpen}>
      <div className="warning-modal__content gradient-border w-[550px]">
        <div className="flex max-md:flex-col items-center max-md:text-center gap-5 mt-5 mb-7 max-md:flex-1 max-md:justify-center">
          <div>
            <h2 className="text-lg max-md:text-xl mb-2 max-md:mb-4">{title}</h2>
            <p className="!text-base max-md:!text-sm">{description}</p>
          </div>
        </div>
        <div className="hr" />
        <div className="warning-modal__footer">
          <PrimaryButton onClick={onOk}>{okButtonText}</PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default SwarmModeModal;
