import React, { useState, useEffect } from "react";
import {
  swarmSupported,
  runSwarmMode,
  checkSwarmModeRunning,
  stopSwarmMode,
} from "shared/helpers/utils";

import PrimaryButton from "../../../shared/components/PrimaryButton";

const SwarmMode = () => {
  const [swarmMode, setSwarmMode] = useState(false);
  const [isSwarmSupported, setIsSwarmSupported] = useState(false);
  const [numBlocks, setNumBlocks] = useState(3);

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

  useEffect(() => {
    swarmSupported().then(setIsSwarmSupported);
  }, []);

  const onStart = async () => {
    console.log("Before");
    try {
      await runSwarmMode(numBlocks);
      console.log("After");
      setSwarmMode(true);
    } catch (error) {
      console.error(error);
    }
    console.log("Run");
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
    isSwarmSupported && (
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
            <input
              className="form-control"
              type="number"
              id="numeric-value"
              name="numeric-value"
              value={numBlocks}
              onChange={(e) => {
                console.log("Running with num_blocks", numBlocks);
                setNumBlocks(Number(e.target.value));
              }}
            />
            <PrimaryButton onClick={onStart}>Start</PrimaryButton>
          </>
        )}
      </div>
    )
  );
};

export default SwarmMode;
