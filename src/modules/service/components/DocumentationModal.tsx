import cross from "assets/images/cross.svg";
import Modal from "react-modal";
import Markdown from "shared/components/Markdown";

import type { DocumentationModalProps } from "../types";

const DocumentationModal = ({ content, isOpen, closeModal }: DocumentationModalProps) => {
  return (
    <Modal
      className="warning-modal documentation-modal--main"
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentElement={(props, children) => (
        <div {...props} onClick={(e) => e.preventDefault()}>
          {children}
        </div>
      )}
      onAfterOpen={() => {
        document.body.setAttribute("style", "overflow: hidden;");
      }}
      onAfterClose={() => {
        document.body.removeAttribute("style");
        document.body.classList.remove("ReactModal__Body--open");
        document.getElementById("#root")?.removeAttribute("aria-hidden");
      }}
    >
      <div className="warning-modal__content gradient-border">
        <div className="documentation-modal scrollbar-custom">
          <button onClick={closeModal} className="w-[40px] -mx-2 mb-5">
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
