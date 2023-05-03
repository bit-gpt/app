import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStatus } from "../shared/api";
import { checkIsDockerRunning, runDockerContainer } from "../utils";
import AppCard from "../components/dashboard/AppCard";
import { AxiosError } from "axios";
import Header from "../shared/components/headers/Header";
import chatLogo from "../assets/images/chat.svg";
import diffusionLogo from "../assets/images/diffusion.svg";
import premAgentLogo from "../assets/images/prem-agent.svg";
import copilotLogo from "../assets/images/copilot.svg";

function Dashboard() {
  const [runPremChatContainer, setRunPremChatContainer] = useState(false);
  const [isPremChatModelReady, setIsPremChatModelReady] = useState(false);
  const [premChatPercentage, setPremChatPercentage] = useState(0);

  useQuery(["modelStatus"], fetchStatus, {
    refetchInterval: isPremChatModelReady ? false : 1000,
    onSuccess: () => {
      setIsPremChatModelReady(true);
      console.log("Model ready to generate.");
    },
    onError: (err: AxiosError<{ message: string; percentage: number }>) => {
      console.log({ err: err.response?.data });
      const percentage = err.response?.data?.percentage || 0;
      console.log(`APIs are not ready yet! Amount completed ${percentage}%`);
      setPremChatPercentage(percentage);
    },
    staleTime: 0,
  });

  const handleRunContainer = () => {
    runDockerContainer();
    setRunPremChatContainer(true);
  };

  useEffect(() => {
    const checkIfDockerContainerIsRunning = async () => {
      const isRunning = await checkIsDockerRunning();
      setRunPremChatContainer(isRunning);
    };
    checkIfDockerContainerIsRunning();
  }, []);

  return (
    <section className="dashboard min-h-screen relative">
      <Header />
      <div className="container px-3 mx-auto z-10 relative">
        <div className="dashboard-top max-w-[600px]">
          <h1 className="dark:text-white">Prem.AI</h1>
          <h2 className="dark:text-white">Your Own AGI in your Pocket.</h2>
          <p className="dark:text-white font-proximaNova-regular">
            Self-Sovereign & Composable AI infrastructure: empowering developers
            and organizations to own their own locally run AGI, accessed
            securely on your trustless and encrypted Premcloud
          </p>
          <button className="mt-8 btn-outline-circle !px-7 border-[2.5px] dark:text-lightsalmonpink dark:border-tulip hover:dark:border-white hover:dark:text-white">
            Learn More <span className="ml-3">&#10230;</span>
          </button>
        </div>
        {/* Apps */}

        <div className="dashboard__popular-app mt-[55px] mb-[49px]">
          <h2 className="font-bold text-[30px] leading-8">Top Popular Apps</h2>
        </div>
        <div className="dashboard-bottom">
          <AppCard
            icon={chatLogo}
            className="dashboard-bottom__card"
            title="Prem Chat"
            description="The Best in Prompting"
          >
            {runPremChatContainer ? (
              isPremChatModelReady ? (
                <Link to="/prem-chat">
                  <button className="btn-outline-circle">Open</button>
                </Link>
              ) : (
                <button className="btn-outline-circle flex items-center">
                  {" "}
                  Downloading... {premChatPercentage}%
                  <svg
                    className="animate-spin ml-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#F49E97"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="#F49E97"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </button>
              )
            ) : (
              <button
                className="btn-outline-circle"
                onClick={(e) => handleRunContainer()}
              >
                Download
                <span className="ml-3">&#10230;</span>
              </button>
            )}
          </AppCard>
          <AppCard
            icon={diffusionLogo}
            className="dashboard-bottom__card"
            title="Prem Michelangelo"
            description="The Best in Prompting"
          >
            <button className="btn-outline-circle">
              {" "}
              Download
              <span className="ml-3">&#10230;</span>
            </button>
          </AppCard>
          <AppCard
            icon={premAgentLogo}
            className="dashboard-bottom__card"
            title="Prem Agent"
            description="The Best in Prompting"
          >
            <button className="btn-outline-circle">
              {" "}
              Download
              <span className="ml-3">&#10230;</span>
            </button>
          </AppCard>
          <AppCard
            icon={copilotLogo}
            className="dashboard-bottom__card"
            title="Prem Copilot"
            description="The Best in Prompting"
          >
            <button className="btn-outline-circle">
              {" "}
              Download
              <span className="ml-3">&#10230;</span>
            </button>
          </AppCard>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
