import Header from "./headers/Header";
import WarningLogo from "../../assets/images/warning.svg";
import appleLogo from "../../assets/images/apple.svg";

type DownloadDockerWall = {
  handleCheckIsDockerRunning: () => void;
};

const DownloadDockerWall = ({
  handleCheckIsDockerRunning,
}: DownloadDockerWall) => {
  return (
    <section className="docker-not-detected flex flex-wrap">
      <Header />
      <div className="flex items-center w-full modal-height">
        <div className="docker-not-detected__modal mx-auto w-[50%] rounded-xl p-[18px]">
          <div className="max-w-[450px] mx-auto">
            <img className="mx-auto" src={WarningLogo} alt="WarningLogo" />
            <div className="text-center mx-auto">
              <h1 className="text-2xl dark:text-brightgray">
                Docker not Detected
              </h1>
              <p className="dark:text-brightgray text-[18px] mt-4">
                In order to run Prem App you need to have <br /> Docker
                installed and running. If you don't have Docker Desktop
                installed, you can go to the link below.
              </p>
            </div>
            <div>
              <a
                className="btn bg-americanpink py-3 px-[22px] my-[49px] rounded-md flex mx-auto max-w-[280px]"
                href="https://www.docker.com/products/docker-desktop/"
                target="_blank"
              >
                <img className="mr-3" src={appleLogo} alt="appleLogo" />
                Download Docker Desktop
              </a>
            </div>
            <div>
              <h3 className="font-[21px]">Dependencies</h3>
              <div className="flex mt-4">
                <p className="w-full text-[#CFCFCF] text-base">Docker</p>
                <p className="text-[#2ED291] text-base">&#10003;&nbsp;Found</p>
              </div>
            </div>
          </div>
          <hr className="border-t-2 opacity-50 mt-[70px] mb-4"/>
          <div className="text-right">
            <button className="btn-outline" onClick={(e) => handleCheckIsDockerRunning()}>
              Check Again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadDockerWall;
