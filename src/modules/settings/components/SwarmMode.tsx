import React, { useState, useEffect } from "react";
import { runSwarmMode, checkSwarmModeRunning, stopSwarmMode } from "shared/helpers/utils";

const SwarmMode = () => {
  const [swarmMode, setSwarmMode] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isRunning = await checkSwarmModeRunning();
      setSwarmMode(isRunning);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onStart = () => {
    runSwarmMode();
    setSwarmMode(true);
  };

  const onStop = () => {
    stopSwarmMode();
    setSwarmMode(false);
  };

  return (
    <div className="flex items-center">
      {swarmMode ? (
        <>
          <label className="text-white mr-2 backend-url md:text-lg text-[11px]">
            Swarm Mode Enabled
          </label>
          <button type="button" onClick={onStop}>
            Stop
          </button>
        </>
      ) : (
        <>
          <label className="text-white mr-2 backend-url md:text-lg text-[11px]">
            Swarm Mode Not Enabled
          </label>
          <button type="button" onClick={onStart}>
            Start
          </button>
        </>
      )}
    </div>
  );
};

export default SwarmMode;
