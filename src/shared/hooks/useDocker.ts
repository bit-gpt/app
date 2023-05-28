import { useCallback, useEffect, useState } from "react";
import { checkIsDockerRunning, runDockerContainer, isBrowserEnv } from "../helpers/utils";

const useDocker = () => {
  const isBrowser = isBrowserEnv();
  const [isDockerRunning, setIsDockerRunning] = useState(false);
  const [isContainerRunning, setIsContainerRunning] = useState(false);
  
  const handleCheckIsDockerRunning = useCallback(() => {
    checkIsDockerRunning().then((result) => {
      setIsDockerRunning(result);
      return runDockerContainer();
    }).then(() => {
      setIsContainerRunning(true);
    });
  }, [setIsDockerRunning, setIsContainerRunning]);

  useEffect(() => {
    if (!isBrowser) {
      handleCheckIsDockerRunning();
    }
  }, []);

  return {
    isDockerRunning: isDockerRunning,
    isContainerRunning: isContainerRunning,
    handleCheckIsDockerRunning,
  };
};

export default useDocker;
