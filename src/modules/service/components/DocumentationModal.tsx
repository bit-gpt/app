import ReactMarkdown from "react-markdown";
import { DocumentationModalProps } from "../types";
import Modal from "react-modal";

const DocumentationModal = ({
  content,
  isOpen,
  closeModal,
}: DocumentationModalProps) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <ReactMarkdown children={content} />
    </Modal>
  );
};

export default DocumentationModal;
