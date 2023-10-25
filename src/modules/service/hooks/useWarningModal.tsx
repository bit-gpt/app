import type React from "react";
import { useState } from "react";
import { useLockedBody } from "usehooks-ts";

const useWarningModal = () => {
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [bodyLocked, setBodyLocked] = useLockedBody(false, "root");
  const openWarningModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsWarningModalOpen(true);
    setBodyLocked(!bodyLocked);
  };

  const closeWarningModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWarningModalOpen(false);
    setBodyLocked(false);
  };

  return { isWarningModalOpen, openWarningModal, closeWarningModal };
};
export default useWarningModal;
