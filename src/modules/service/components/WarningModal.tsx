import Modal from "react-modal";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";
import type { WarningModalProps } from "shared/types";

import WarningModalIcon from "../../../assets/images/warning.svg";

const WarningModal = ({
  onCancel,
  onOk,
  cancelButtonText = "Cancel",
  okButtonText = "Ok",
  icon,
  isOpen,
  title = "Warning",
  description,
}: WarningModalProps) => {
  return (
    <Modal className="warning-modal" isOpen={isOpen} onRequestClose={onCancel}>
      <div className="warning-modal__content gradient-border w-[550px]">
        <div className="flex max-md:flex-col items-center max-md:text-center gap-5 mt-5 mb-7 max-md:flex-1 max-md:justify-center">
          {icon || <img src={WarningModalIcon} alt="WarningModalIcon" width={128} height={128} />}
          <div>
            <h2 className="text-lg max-md:text-xl mb-2 max-md:mb-4">{title}</h2>
            <p className="!text-base max-md:!text-sm">{description}</p>
          </div>
        </div>
        <div className="hr" />
        <div className="warning-modal__footer">
          <OutlineCircleButton
            onClick={onCancel}
            className="!rounded-md items-center flex !border h-[43px] !mt-0 justify-center opacity-70 w-full max-md:order-2"
          >
            {cancelButtonText}
          </OutlineCircleButton>
          <PrimaryButton onClick={onOk} className="w-full">
            {okButtonText}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default WarningModal;
