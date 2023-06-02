import { Tooltip } from "react-tooltip";
import Header from "shared/components/Header";
import WarningLogo from "assets/images/warning.svg";
import appleLogo from "assets/images/apple.svg";
import { SystemCheckProps } from "../types";
import Dependency from "./Dependency";
import PrimaryButton from "shared/components/PrimaryButton";

const SystemCheck = ({
  handleCheckIsDockerRunning,
  isDockerRunning,
  isServerRunning,
  back,
  next,
}: SystemCheckProps) => {
  return (
    <section className="docker-not-detected flex flex-wrap bg-lines relative">
      <Header />
      <div className="flex items-center w-full modal-height">
        <div className="docker-modal-wrap mx-auto md:max-w-[600px] max-w-[350px] w-full rounded-xl">
          <div className="docker-not-detected__modal rounded-xl p-[18px]">
            <div className="max-w-[450px] mx-auto relative z-10">
              <img
                className="mx-auto w-[109px] h-[109px] mt-[30px]"
                src={WarningLogo}
                alt="WarningLogo"
              />
              <div className="text-center mx-auto mt-5">
                <h1 className="text-2xl dark:text-brightgray">
                  Docker not Detected
                </h1>
                <p className="dark:text-brightgray text-[18px] font-proximaNova-regular mt-4">
                  In order to run Prem App you need to have <br /> Docker
                  installed and running.
                </p>
              </div>
              <div>
                <a
                  className="btn bg-americanpink font-proximaNova-regular py-3 px-[22px] my-[49px] rounded-md flex mx-auto max-w-[280px]"
                  href="https://www.docker.com/products/docker-desktop/"
                  target="_blank"
                >
                  <img className="mr-3" src={appleLogo} alt="appleLogo" />
                  Download Docker Desktop
                </a>
              </div>
              <div>
                <h3 className="text-[20px]">Dependencies</h3>
                <Dependency
                  isRunning={isDockerRunning}
                  status={isDockerRunning ? "Found" : "Not Found"}
                  name="Docker"
                  tooltip={
                    <div>
                      In order to run Prem App you need to have
                      <br /> Docker installed and running.
                    </div>
                  }
                />
                <Dependency
                  isRunning={isServerRunning}
                  status={isServerRunning ? "Running" : "Not Running"}
                  name="Daemon"
                  tooltip={
                    <div>
                      In order to run Prem App you need to have
                      <br /> Daemon installed and running.
                    </div>
                  }
                />

                <Dependency
                  isRunning={true}
                  status="8gb"
                  name="Memory"
                  tooltip={
                    <div>
                      In order to run Prem App you need to have
                      <br />
                      at least 8gb of memory.
                    </div>
                  }
                />
              </div>
            </div>
            <hr className="border-t-2 -mx-[18px] opacity-50 mt-[70px] mb-4" />
            <div className="text-right">
            <button
                className="btn-outline"
                onClick={back}
              >
                Back
              </button>
              <button
                className="btn-outline !px-9 ml-4"
                onClick={() => handleCheckIsDockerRunning()}
              >
                Check Again
              </button>
              <PrimaryButton
                disabled={!(isDockerRunning && isServerRunning)}
                className="!px-9 ml-4"
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
