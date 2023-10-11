import { useState, useEffect } from "react";
import {
  swarmSupported,
  runSwarmMode,
  checkSwarmModeRunning,
  stopSwarmMode,
  petalsModels,
} from "shared/helpers/utils";

import PrimaryButton from "../../../shared/components/PrimaryButton";

const SwarmMode = () => {
  const [swarmMode, setSwarmMode] = useState(false);
  const [isSwarmSupported, setIsSwarmSupported] = useState(false);
  const [numBlocks, setNumBlocks] = useState(3);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");

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
    try {
      await runSwarmMode(numBlocks, model);
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

  useEffect(() => {
    async function fetchData() {
      try {
        const options = await petalsModels();
        setModelOptions(options);
        setModel(options[0]);
      } catch (error) {
        console.error(error);
        setModelOptions([]);
      }
    }

    fetchData();
  }, []);

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
              className="form-control mr-1"
              type="number"
              min="1"
              max="10"
              value={numBlocks}
              onChange={(e) => {
                setNumBlocks(Number(e.target.value));
              }}
            />
            <div className="select-control">
              <select
                value={model}
                onChange={(e) => {
                  setModel(e.target.value);
                }}
              >
                {modelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <PrimaryButton onClick={onStart}>Start</PrimaryButton>
          </>
        )}
      </div>
    )
  );
};

export default SwarmMode;
