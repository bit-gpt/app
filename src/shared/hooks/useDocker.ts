import { useCallback, useEffect, useRef, useState } from "react";
import { checkIsDockerRunning, runDockerContainer, isBrowserEnv, checkIsContainerRunning, checkIsServerRunning } from "../helpers/utils";

const useDocker = () => {
  const isBrowser = isBrowserEnv();
  const [isDockerRunning, setIsDockerRunning] = useState<boolean>(false);
  const [isContainerRunning, setIsContainerRunning] = useState<boolean>(false);
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false);
  

  const handleCheckIsDockerRunning = useCallback(async () => {
    try {
      const dockerRunning = await checkIsDockerRunning();
      if (!dockerRunning) {
        setIsDockerRunning(false);
        return
      };
      setIsDockerRunning(true);

      const containerRunning = await checkIsContainerRunning();
      if (!containerRunning) {
        setIsContainerRunning(false);
        await runDockerContainer();
        return;
      }
      setIsContainerRunning(true);

      const serverRunning = await checkIsServerRunning();
      if (!serverRunning) {
        setIsServerRunning(false);
        const interval = setInterval(async () => {
          const serverRunning = await checkIsServerRunning();
          if (serverRunning) {
            setIsServerRunning(true);
            clearInterval(interval);
          }
        }, 500);
        return;
      }
      setIsServerRunning(true);
    } catch (error) {
      throw error;
    }
  }, [setIsDockerRunning, setIsContainerRunning, setIsServerRunning]);

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
    isServerRunning: isServerRunning,
    handleCheckIsDockerRunning,
  };
};

export default useDocker;
