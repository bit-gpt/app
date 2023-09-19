import React, { useState, useEffect } from "react";
import { runSwarmMode, checkSwarmModeRunning, stopSwarmMode } from "shared/helpers/utils";

import PrimaryButton from "../../../shared/components/PrimaryButton";

const SwarmMode = () => {
  const [swarmMode, setSwarmMode] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isRunning = await checkSwarmModeRunning();
      setSwarmMode(isRunning);
    }, 1000);

    console.log("intervalId", intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const onStart = async () => {
    try {
      await runSwarmMode();
      setSwarmMode(true);
    } catch (error) {
      console.error(error);
    }
  };

  const onStop = async () => {
    try {
      await stopSwarmMode();
      setSwarmMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-end justify-between mr-[45px]">
      {swarmMode ? (
        <>
          <label className="text-grey-300 mr-2 backend-url md:text-lg text-[11px]">
            Swarm Mode Enabled
          </label>
          <PrimaryButton onClick={onStop}>Stop</PrimaryButton>
        </>
      ) : (
        <>
          <label className="text-grey-300 mr-2 backend-url md:text-lg text-[11px]">
            Swarm Mode Not Enabled
          </label>
          <PrimaryButton onClick={onStart}>Start</PrimaryButton>
        </>
      )}
    </div>
  );
};

export default SwarmMode;
