import Modal from "react-modal";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";
import WarningModalIcon from "shared/components/WarningModalIcon";
import type { WarningModalProps } from "shared/types";

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
        <div className="flex maxMd:flex-col maxMd:item-center maxMd:text-center md:items-start gap-5 mt-5 mb-7 maxMd:flex-1 maxMd:justify-center">
          <div className="md:mb-5 maxSm:-mx-3">
            <div className="polygon-shape maxMd:mx-auto">{icon || <WarningModalIcon />}</div>
          </div>
          <div>
            <h2 className="text-lg maxMd:text-xl mb-2 maxMd:mb-4">{title}</h2>
            <p className="!text-base maxMd:!text-sm">{description}</p>
          </div>
        </div>
        <div className="hr" />
        <div className="warning-modal__footer">
          <OutlineCircleButton
            onClick={onCancel}
            className="!rounded-md items-center flex !border h-[43px] !mt-0 justify-center opacity-70 w-full maxMd:order-2"
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
