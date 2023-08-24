import appleLogo from "assets/images/apple.svg";
import arrow from "assets/images/arrow.svg";
import Logo from "assets/images/brand-logo.svg";
import computerLogo from "assets/images/computer.svg";
import regenerate from "assets/images/regenerate.svg";
import PrimaryButton from "shared/components/PrimaryButton";
import { SYSTEM_MEMORY_LIMIT } from "shared/helpers/utils";
import useSystemStats from "shared/hooks/useSystemStats";

import type { SystemCheckProps } from "../types";

import Dependency from "./Dependency";

const SystemCheck = ({
  handleCheckIsDockerRunning,
  isDockerRunning,
  isServerRunning,
  back,
  next,
}: SystemCheckProps) => {
  const { data: response, isLoading, refetch } = useSystemStats();

  const memoryLimit = response?.data?.memory_limit;
  const isMemorySufficient = memoryLimit! > SYSTEM_MEMORY_LIMIT;

  const onCheckAgainClick = () => {
    handleCheckIsDockerRunning();
    refetch();
  };

  return (
    <section className="system-check flex flex-wrap bg-lines relative">
      <div className="bg-primary w-full py-2 h-9 text-center max-sm:px-1 z-[11]">
        <p className="text-grey-300 text-sm">
          Don't have requirements? Try the &nbsp;
          <a
            href="https://app.prem.ninja/"
            target="_blank"
            className="underline decoration"
            rel="noreferrer"
          >
            Prem App
          </a>
          &nbsp; demo.
        </p>
      </div>
      <div className="welcome-logo z-[1] w-full">
        <img src={Logo} alt="logo" />
        <button onClick={back}>
          <img src={arrow} alt="arrow" />
        </button>
      </div>
      <div className="relative z-[1] mx-auto max-md:w-full system-check__container">
        <div className="mx-auto md:max-w-[600px] max-md:px-6 w-full rounded-xl">
          <div className="">
            <div className="md:max-w-[450px] mx-auto relative z-10">
              <img
                className="mx-auto w-[85px] h-[60px] my-[30px]"
                src={computerLogo}
                alt="computerLogo"
              />
              <div className="text-center mx-auto mt-5">
                <h1 className="text-xl text-grey-300">System Check</h1>
                <p className="text-grey-300 text-sm  my-4">
                  For Prem App to run smoothly you need:
                </p>
              </div>
              <div className="system-check__requirements">
                <h3 className="text-base text-white">Requirements:</h3>
                <Dependency
                  isRunning={isDockerRunning}
                  status={isDockerRunning ? "Found" : "Not Found"}
                  name="Docker Engine"
                  id={"docker"}
                  tooltip={<div>Prem App requires Docker installed and running.</div>}
                />
                <Dependency
                  isRunning={isServerRunning}
                  status={isServerRunning ? "Running" : "Not Running"}
                  name="Prem Daemon"
                  id={"daemon"}
                  tooltip={
                    <div>
                      Prem App requires Prem Daemon to be up and running. <br /> The Daemon is
                      automatically started when docker is running.
                    </div>
                  }
                />
                <Dependency
                  isLoading={isLoading}
                  isRunning={isMemorySufficient}
                  status={isMemorySufficient ? `${memoryLimit}GiB` : `> ${SYSTEM_MEMORY_LIMIT}GiB`}
                  name="Memory Allocated to Docker"
                  id={"memory"}
                  tooltip={
                    <div>
                      Prem App you requires at least <br /> {SYSTEM_MEMORY_LIMIT}GiB of RAM
                      allocated for Docker Engine.
                    </div>
                  }
                />
              </div>
              <div className="text-center mt-6 mb-14">
                <button
                  className="text-white opacity-70 mx-auto flex items-center text-sm"
                  onClick={() => onCheckAgainClick()}
                >
                  <img
                    width={18}
                    height={18}
                    src={regenerate}
                    alt="regenerate-logo"
                    className="mr-2"
                  />
                  <span className="border-b">Check Again</span>
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 items-center flex-wrap">
              <a
                className="border border-white text-white !rounded-[6px]  py-3 px-[22px] flex justify-center"
                href="https://www.docker.com/products/docker-desktop/"
                target="_blank"
                rel="noreferrer"
              >
                <img className="mr-3" src={appleLogo} alt="appleLogo" />
                Download Docker Desktop
              </a>
              <PrimaryButton
                disabled={!(isDockerRunning && isServerRunning)}
                className="!px-9 !h-[50px] cursor-pointer"
                onClick={next}
              >
                Next
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemCheck;
