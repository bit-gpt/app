import { useCallback, useEffect, useState } from "react";
import { checkIsDockerRunning } from "../utils";

const useDocker = () => {
  const [isDockerRunning, setIsDockerRunning] = useState(false);

  const handleCheckIsDockerRunning = useCallback(() => {
    checkIsDockerRunning().then((result) => {
      setIsDockerRunning(result);
    });
  }, [setIsDockerRunning]);

  useEffect(() => {
    handleCheckIsDockerRunning();
  }, []);

  return { isDockerRunning, handleCheckIsDockerRunning };
};

export default useDocker;
