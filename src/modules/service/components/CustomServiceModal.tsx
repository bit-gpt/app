import { highlight, languages } from "prismjs";
import { useState } from "react";
import Modal from "react-modal";
import Editor from "react-simple-code-editor";
import { toast } from "react-toastify";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";

import useAddService from "../../../shared/hooks/useAddService";
import useGetServices from "../../../shared/hooks/useGetServices";
import type { CustomServiceModalProps } from "../types";

const CustomServiceModal = ({ isOpen, closeModal }: CustomServiceModalProps) => {
  const [code, setCode] = useState(
    `{
      "id": "string",
      "name": "string",
      "modelInfo": {},
      "interfaces": [
        "string"
      ],
      "defaultExternalPort": 0,
      "promptTemplate": "string",
      "serviceType": "binary",
      "version": "string",
      "serveCommand": "string";
      "weightsDirectoryUrl": "string",
      "weightsFiles": [
        "string"
      ],
      "binariesUrl": {
        "aarch64-apple-darwin": "string" | null,
        "x86_64-apple-darwin": "string" | null,
        "universal-apple-darwin": "string" | null
      },
    }`,
  );

  const { mutate: addService, isPending } = useAddService();
  const { refetch } = useGetServices();

  const onCancel = () => {
    closeModal();
  };

  const onOk = () => {
    try {
      const service = JSON.parse(code);
      addService(
        { service },
        {
          onSuccess: async () => {
            closeModal();
            toast.success("Service added successfully");
            await refetch();
          },
          onError: () => {
            toast.error("Error adding service");
          },
        },
      );
    } catch (e) {
      toast.error("Invalid JSON");
      return;
    }
  };

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
      <div className="warning-modal__content gradient-border w-[550px]">
        <h1 className="text-grey-300 text-2xl my-4">Custom Service</h1>
        <div className="documentation-modal mb-4">
          <div className="documentation-markdown custom-service__markdown">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.javascript, "javascript")}
              padding={10}
              textareaClassName="scrollbar-custom"
              style={{
                borderRadius: 11,
                fontSize: 14,
              }}
            />
          </div>
        </div>
        <div className="hr" />
        <div className="warning-modal__footer">
          <OutlineCircleButton
            onClick={onCancel}
            className="!rounded-md items-center flex !border h-[43px] !mt-0 justify-center opacity-70 w-full max-md:order-2"
          >
            Cancel
          </OutlineCircleButton>
          <PrimaryButton onClick={onOk} className="w-full" disabled={isPending}>
            {isPending ? "Adding ..." : "OK"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default CustomServiceModal;
