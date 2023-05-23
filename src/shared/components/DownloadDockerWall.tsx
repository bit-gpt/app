import { DownloadDockerWallProps } from "shared/types";
import WarningLogo from "assets/images/warning.svg";
import appleLogo from "assets/images/apple.svg";
import Header from "./Header";
import { Tooltip } from "react-tooltip";

const DownloadDockerWall = ({
  handleCheckIsDockerRunning,
  isDockerRunning,
}: DownloadDockerWallProps) => {
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
                <div className="flex justify-between mt-4">
                  <p className="text-[#CFCFCF] text-base">Docker</p>
                  {isDockerRunning && (
                    <p className="text-[#2ED291] text-base">
                      &#10003;&nbsp;Found
                    </p>
                  )}
                  {!isDockerRunning && (
                    <>
                      <button id="not_found" className="text-[#F9B96D] text-base flex gap-3">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_1084_304)">
                            <path
                              d="M9 4.33334C9 4.53112 8.94136 4.72446 8.83147 4.88891C8.72159 5.05336 8.56541 5.18153 8.38269 5.25722C8.19996 5.3329 7.9989 5.35271 7.80491 5.31412C7.61093 5.27554 7.43275 5.1803 7.2929 5.04044C7.15305 4.90059 7.0578 4.72241 7.01922 4.52843C6.98063 4.33445 7.00044 4.13338 7.07613 3.95065C7.15181 3.76793 7.27999 3.61175 7.44443 3.50187C7.60888 3.39199 7.80222 3.33334 8 3.33334C8.26522 3.33334 8.51958 3.43869 8.70711 3.62623C8.89465 3.81377 9 4.06812 9 4.33334ZM16 8C16 6.41775 15.5308 4.87104 14.6518 3.55544C13.7727 2.23985 12.5233 1.21447 11.0615 0.608967C9.59966 0.00346629 7.99113 -0.15496 6.43928 0.153721C4.88743 0.462403 3.46197 1.22433 2.34315 2.34315C1.22433 3.46197 0.462403 4.88743 0.153721 6.43928C-0.15496 7.99113 0.00346629 9.59966 0.608967 11.0615C1.21447 12.5233 2.23985 13.7727 3.55544 14.6518C4.87104 15.5308 6.41775 16 8 16H16V8ZM14.6667 8V14.6667H8C6.68146 14.6667 5.39253 14.2757 4.2962 13.5431C3.19987 12.8106 2.34539 11.7694 1.84081 10.5512C1.33622 9.33305 1.2042 7.99261 1.46144 6.6994C1.71867 5.4062 2.35361 4.21831 3.28596 3.28596C4.21831 2.35361 5.4062 1.71867 6.6994 1.46144C7.99261 1.2042 9.33305 1.33622 10.5512 1.84081C11.7694 2.34539 12.8106 3.19987 13.5431 4.2962C14.2757 5.39253 14.6667 6.68146 14.6667 8ZM9.33334 8C9.33334 7.64638 9.19286 7.30724 8.94281 7.0572C8.69277 6.80715 8.35363 6.66667 8 6.66667H6.66667V8H8V12.6667H9.33334V8Z"
                              fill="#F9B96D"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1084_304">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Not Found
                      </button>
                      <Tooltip anchorSelect="#not_found" place="bottom" className="topltip">
                        In order to run Prem App you need to have
                        <br /> Docker installed and running.
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-t-2 -mx-[18px] opacity-50 mt-[70px] mb-4" />
            <div className="text-right">
              <button
                className="btn-outline"
                onClick={(e) => handleCheckIsDockerRunning()}
              >
                Check Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadDockerWall;
