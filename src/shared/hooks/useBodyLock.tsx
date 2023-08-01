/* eslint-disable */
import { useEffect } from "react";
import { useLockedBody } from "usehooks-ts";

const useBodyLock = () => {
  const [bodyLocked, setBodyLocked] = useLockedBody(false, "root");
  const defaultBodyLocked = () => {
    setBodyLocked(!bodyLocked);
  };
  useEffect(() => {}, [defaultBodyLocked]);
  return { bodyLocked, setBodyLocked };
};

export default useBodyLock;
