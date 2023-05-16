import { useCallback, useEffect, useState } from "react";
import { checkIsDockerRunning, isDesktopEnv } from "../../utils";

const useDocker = () => {
  const isDesktop = isDesktopEnv();
  const [isDockerRunning, setIsDockerRunning] = useState(false);

  const handleCheckIsDockerRunning = useCallback(() => {
    checkIsDockerRunning().then((result) => {
      setIsDockerRunning(result);
    });
  }, [setIsDockerRunning]);

  useEffect(() => {
    if (isDesktop) {
      handleCheckIsDockerRunning();
    }
  }, []);

  return {
    isDockerRunning: isDockerRunning,
    handleCheckIsDockerRunning,
  };
};

export default useDocker;
