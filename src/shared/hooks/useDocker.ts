import { useCallback, useEffect, useRef, useState } from "react";
import { checkIsDockerRunning, runDockerContainer, isBrowserEnv, checkIsContainerRunning } from "../helpers/utils";

const useDocker = () => {
  const isBrowser = isBrowserEnv();
  const [isDockerRunning, setIsDockerRunning] = useState<boolean>(false);
  const [isContainerRunning, setIsContainerRunning] = useState<boolean>(false);
  

  const handleCheckIsDockerRunning = useCallback(async () => {
    try {
      const dockerRunning = await checkIsDockerRunning();
      setIsDockerRunning(dockerRunning);
      if (!dockerRunning) return;
      const containerRunning = await checkIsContainerRunning();
      setIsContainerRunning(containerRunning);
      if (containerRunning) return; 
      await runDockerContainer();
    } catch (error) {
      throw error;
    }
  }, [setIsDockerRunning, setIsContainerRunning]);

  const intervalRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (isBrowser) return;

    (async () => {
      await handleCheckIsDockerRunning();
    })();

    intervalRef.current = setInterval(async () => {
      await handleCheckIsDockerRunning();
    }, 5000);
    // cleanup function - clear the interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    isDockerRunning: isDockerRunning,
    isContainerRunning: isContainerRunning,
    handleCheckIsDockerRunning,
  };
};

export default useDocker;
