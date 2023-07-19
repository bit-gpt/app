import { useLockedBody } from "usehooks-ts";

const useBodyLock = () => {
  const [bodyLocked, setBodyLocked] = useLockedBody(false, "root");

  return { bodyLocked, setBodyLocked };
};

export default useBodyLock;
