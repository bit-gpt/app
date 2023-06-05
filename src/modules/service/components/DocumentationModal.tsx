import { DocumentationModalProps } from "../types";
import Modal from "react-modal";
import cross from "assets/images/cross.svg";
import Markdown from "shared/components/Markdown";

const DocumentationModal = ({
  content,
  isOpen,
  closeModal,
}: DocumentationModalProps) => {
  return (
    <Modal
      className="warning-modal"
      isOpen={isOpen}
      onRequestClose={closeModal}
    >
      <div className="warning-modal__content gradient-border">
        <div className="documentation-modal scrollbar-custom">
          <button onClick={closeModal} className="w-[40px] -mx-2 mb-3">
            <img src={cross} alt="cross" className="h-4 w-4 mx-auto" />
          </button>
          <div className="documentation-markdown">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentationModal;
