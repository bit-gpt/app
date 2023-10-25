/* eslint-disable prettier/prettier */
import { useState, useEffect} from "react";
import { Tooltip } from "react-tooltip";
import Spinner from "shared/components/Spinner";
import {
  swarmSupported,
  runSwarmMode,
  checkSwarmModeRunning,
  stopSwarmMode,
  petalsModels,
  userName,
} from "shared/helpers/utils";

import PrimaryButton from "../../../shared/components/PrimaryButton";

import SwarmModeModal from "./SwarmModeModal";

export enum Swarm {
  Creating = "creating",
  Active = "active",
  Inactive = "inactive",
}

const SwarmMode = () => {
  const [swarmMode, setSwarmMode] = useState(Swarm.Inactive);
  const [isSwarmSupported, setIsSwarmSupported] = useState(false);
  const [numBlocks, setNumBlocks] = useState(3);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isRunning = await checkSwarmModeRunning();
      if (isRunning) {
        setSwarmMode(Swarm.Active);
      }
    }, 500);

    console.log("intervalId", intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    swarmSupported().then(setIsSwarmSupported);
  }, []);

  const onStart = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setSwarmMode(Swarm.Creating);
      const user = await userName();
      await runSwarmMode(numBlocks, model, user + "@premAI");
      setIsOpen(true);
      setSwarmMode(Swarm.Active);
    } catch (error) {
      console.error(error);
    }
  };

  const onStop = async () => {
    try {
      await stopSwarmMode();
      setSwarmMode(Swarm.Inactive);
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

  const closeModal = () => {
    setIsOpen(false);
  };

  return isSwarmSupported ? (
    <div className="flex items-end justify-between mr-[45px]">
      <h2 className="text-grey-300 text-lg mt-10 mb-4">Prem Network</h2>

      {swarmMode === Swarm.Active ? (
        <>
          <PrimaryButton onClick={onStop}>Stop</PrimaryButton>
        </>
      ) : swarmMode === Swarm.Inactive ? (
        <>
          <form className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg shadow-md">
            <input
              id="num_blocks"
              className="form-control mr-1 w-36 text-center"
              type="number"
              min="1"
              value={numBlocks}
              onChange={(e) => {
                setNumBlocks(Number(e.target.value));
              }}
            />
            <Tooltip anchorSelect="#num_blocks" place="top" className="tooltip">
              {<div>Number of Transformer blocks to serve</div>}
            </Tooltip>

            <div className="relative" id="model">
              <select
                className="form-control block appearance-none w-full pr-8"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <Tooltip anchorSelect="#model" place="top" className="tooltip">
              {<div>Model you intend to contribute to</div>}
            </Tooltip>

            <PrimaryButton
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:bg-indigo-700 transition duration-150 ease-in-out"
              onClick={onStart}
            >
              Start
            </PrimaryButton>
          </form>
        </>
      ) : (
        <div className="flex justify-center mb-5">
          <Spinner className="h-10 w-10" />
        </div>
      )}

      <SwarmModeModal
        description="Congratulations, you are now part of the Swarm. Check it out here: https://explorer.prem.ninja"
        title="Swarm Contributor"
        isOpen={open}
        onOk={closeModal}
        onCancel={() => void 0}
      />
    </div>
  ) : null;
};

export default SwarmMode;
