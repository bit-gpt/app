import { CustomServiceModalProps, Service } from "../types";
import Modal from "react-modal";
import cross from "assets/images/cross.svg";
import Editor from "react-simple-code-editor";
import { useState } from "react";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism-solarizedlight.css"; //Example style, you can use another
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";
import { useMutation } from "@tanstack/react-query";
import { add } from "lodash";
import addService from "../api/addService";
import { toast } from "react-toastify";

const CustomServiceModal = ({ isOpen, closeModal }: CustomServiceModalProps) => {
  const [code, setCode] = useState(
    `{
      "id": "string",
      "name": "string",
      "modelInfo": {},
      "interfaces": [
        "string"
      ],
      "dockerImages": {},
      "defaultPort": 0,
      "defaultExternalPort": 0,
      "runningPort": 0,
      "volumePath": "string",
      "volumeName": "string",
      "envVariables": [
        "string"
      ],
      "promptTemplate": "string"
    }`
  );

  const { mutate, isLoading } = useMutation((request: Service) => addService(request));

  const onCancel = () => {
    closeModal();
  };

  const onOk = () => {
    try {
      const service = JSON.parse(code);
      mutate(service, {
        onSuccess: () => {
          closeModal();
          toast.success("Service added successfully");
        },
        onError: () => {
          toast.error("Error adding service");
        },
      });
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
      <div className="warning-modal__content gradient-border">
        <div className="documentation-modal scrollbar-custom">
          <button onClick={closeModal} className="w-[40px] -mx-2 mb-5">
            <img src={cross} alt="cross" className="h-4 w-4 mx-auto" />
          </button>
          <div className="documentation-markdown">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
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
          <PrimaryButton onClick={onOk} className="w-full" disabled={isLoading}>
            {isLoading ? "Adding ..." : "OK"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

export default CustomServiceModal;
