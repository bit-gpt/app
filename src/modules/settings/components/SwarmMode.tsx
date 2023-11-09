/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import DeleteIconNew from "shared/components/DeleteIconNew";
import Spinner from "shared/components/Spinner";
import {
  swarmSupported,
  createEnvironment,
  deleteEnvironment,
  runSwarmMode,
  checkSwarmModeRunning,
  stopSwarmMode,
  petalsModels,
  userName,
} from "shared/helpers/utils";
import useSettingStore from "shared/store/setting";
import { EnvironmentDeletion, Swarm } from "shared/types";

import PrimaryButton from "../../../shared/components/PrimaryButton";

import SwarmModeModal from "./SwarmModeModal";

const SwarmMode = () => {
  const swarmMode = useSettingStore((state) => state.swarmMode);
  const [isSwarmSupported, setIsSwarmSupported] = useState(false);
  const hasEnvironment = useSettingStore((state) => state.environmentDeletion);
  const [numBlocks, setNumBlocks] = useState(3);
  const [modelOptions, setModelOptions] = useState<string[]>([]);
  const [model, setModel] = useState<string>("");
  const [open, setIsOpen] = useState(false);
  const swarmInfo = useSettingStore((state) => state.swarmInfo);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isRunning = await checkSwarmModeRunning();
      if (isRunning) {
        useSettingStore.getState().setSwarmMode(Swarm.Active);
      }
    }, 1500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    swarmSupported().then(setIsSwarmSupported);
  }, []);

  const onStart = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      useSettingStore.getState().setSwarmMode(Swarm.Creating);
      await createEnvironment();
      useSettingStore.getState().setEnvironmentDeletion(EnvironmentDeletion.Idle);
      const user = await userName();
      const publicName = user + "@premAI";
      await runSwarmMode(numBlocks, model, publicName);
      setIsOpen(true);
      useSettingStore.getState().setSwarmMode(Swarm.Active);
      useSettingStore.getState().setSwarmInfo({ model, numBlocks, publicName });
    } catch (error) {
      console.error(error);
    }
  };

  const onStop = async () => {
    try {
      await stopSwarmMode();
      useSettingStore.getState().setSwarmMode(Swarm.Inactive);
      useSettingStore.getState().setSwarmInfo(null);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteClick = async () => {
    try {
      useSettingStore.getState().setEnvironmentDeletion(EnvironmentDeletion.Progress);
      await deleteEnvironment();
      useSettingStore.getState().setEnvironmentDeletion(EnvironmentDeletion.Completed);
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

  const description = (
    <span>
      Congratulations, you are now part of the Swarm. <br />
      <br /> In less than an hour you will be visible on the public peer-to-peer network <br />{" "}
      Check it out at{" "}
      <a href="https://network.premai.io" target="_blank" rel="noopener noreferrer">
        <b>network.premai.io</b>
      </a>
    </span>
  );

  return isSwarmSupported ? (
    <>
      <div className="flex flex-wrap justify-between md:mr-[45px] gap-4">
        <h2 className="text-grey-300 text-lg backend-url">
          Prem Network <span className="ml-2 text-primary text-xs">BETA</span>
        </h2>

        {swarmMode === Swarm.Active ? (
          <>
            <PrimaryButton onClick={onStop}>Stop</PrimaryButton>
          </>
        ) : swarmMode === Swarm.Inactive ? (
          <>
            {hasEnvironment === EnvironmentDeletion.Idle ? (
              <div className="ml-auto text-right py-4">
                <button id="delete" className="px-2" onClick={onDeleteClick}>
                  <DeleteIconNew />
                </button>

                <Tooltip anchorSelect="#delete" place="left" className="tooltip">
                  {<div>Reset to default</div>}
                </Tooltip>
              </div>
            ) : hasEnvironment === EnvironmentDeletion.Progress ? (
              <>
                <div id="delete-progress">
                  <Spinner className="h-10 w-10" />
                </div>
                <Tooltip anchorSelect="#delete-progress" place="left" className="tooltip">
                  {<div>Deleting Prem Network environment</div>}
                </Tooltip>
              </>
            ) : null}
            <form className="flex flex-col w-full gap-y-2">
              <div className="flex flex-wrap items-center justify-between">
                <span id="model" className="text-grey-200 opacity-70">
                  Model
                </span>

                <div className="relative">
                  <select
                    className="form-control appearance-none w-80"
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
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-[20px]">
                    <svg
                      fill="#FFFFFF"
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>

                <Tooltip anchorSelect="#model" place="bottom" className="tooltip">
                  {<div>Model you intend to contribute to</div>}
                </Tooltip>
              </div>

              <div className="flex flex-wrap items-center justify-between mb-2">
                <span id="num_blocks" className="text-grey-200 opacity-70">
                  Blocks
                </span>
                <input
                  className="form-control text-center w-80"
                  type="number"
                  min="1"
                  value={numBlocks}
                  onChange={(e) => {
                    setNumBlocks(Number(e.target.value));
                  }}
                />
                <Tooltip anchorSelect="#num_blocks" place="bottom" className="tooltip">
                  {<div>Number of Transformer blocks to serve</div>}
                </Tooltip>
              </div>

              <div className="text-right mt-8">
                <PrimaryButton className="" onClick={onStart}>
                  Start
                </PrimaryButton>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center space-x-4 p-4">
            <span className="text-grey-200 opacity-70 m-1">
              Please do not close the app as we are configuring your environment for the Prem
              Network...
            </span>
            <Spinner className="h-10 w-10" />
          </div>
        )}

        <SwarmModeModal
          description={description}
          title="Swarm Contributor"
          isOpen={open}
          onOk={closeModal}
        />
      </div>

      {swarmInfo && Object.keys(swarmInfo).length ? (
        <div className="flex flex-col">
          <div>
            <span className="text-grey-300 font-bold">Public Name:</span>
            <span className="text-grey-100 ml-2">{swarmInfo.publicName}</span>
          </div>
          <div>
            <span className="text-grey-300 font-bold">Model:</span>
            <span className="text-grey-100 ml-2">{swarmInfo.model}</span>
          </div>
          <div>
            <span className="text-grey-300 font-bold">Number of Blocks:</span>
            <span className="text-grey-100 ml-2">{swarmInfo.numBlocks} blocks</span>
          </div>
        </div>
      ) : null}
    </>
  ) : null;
};

export default SwarmMode;
