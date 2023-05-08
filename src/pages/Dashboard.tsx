import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStatus } from "../shared/api";
import { runDockerContainer } from "../utils";
import AppCard from "../components/dashboard/AppCard";
import { AxiosError } from "axios";
import Header from "../shared/components/headers/Header";
import chatLogo from "../assets/images/chat.svg";
import diffusionLogo from "../assets/images/diffusion.svg";
import premAgentLogo from "../assets/images/prem-agent.svg";
import copilotLogo from "../assets/images/copilot.svg";
import OutlineCircleButton from "../shared/components/OutlineCircleButton";
import DownloadButton from "../components/dashboard/DownloadButton";
import Spinner from "../shared/components/Spinner";

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

  return (
    <section className="dashboard min-h-screen relative">
      <Header />
      <div className="container px-3 mx-auto z-10 relative">
        <div className="dashboard-top max-w-[600px]">
          <h1 className="dark:text-white">PremAI</h1>
          <h2 className="dark:text-white">Your Own AGI in your Pocket.</h2>
          <p className="dark:text-white font-proximaNova-regular">
            Self-Sovereign & Composable AI infrastructure: empowering developers
            and organizations to own their own locally run AGI, accessed
            securely on your trustless and encrypted Premcloud
          </p>
          <OutlineCircleButton className="mt-8 !px-7 border-[2.5px] dark:text-lightsalmonpink dark:border-tulip hover:dark:border-white hover:dark:text-white flex items-center">
            Learn More
            <svg
              className="ml-3"
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.9592 3.38892L12.5131 0.717707C12.4543 0.653674 12.3844 0.60285 12.3074 0.568166C12.2304 0.533482 12.1477 0.515625 12.0643 0.515625C11.9809 0.515625 11.8983 0.533482 11.8212 0.568166C11.7442 0.60285 11.6743 0.653674 11.6155 0.717707C11.4978 0.845708 11.4317 1.01886 11.4317 1.19935C11.4317 1.37983 11.4978 1.55298 11.6155 1.68098L13.8657 4.13358H0.977775C0.810139 4.13358 0.649369 4.20556 0.530833 4.33368C0.412296 4.4618 0.345703 4.63557 0.345703 4.81676C0.345703 4.99795 0.412296 5.17171 0.530833 5.29984C0.649369 5.42796 0.810139 5.49993 0.977775 5.49993H13.9036L11.6155 7.9662C11.5563 8.02971 11.5093 8.10526 11.4772 8.18852C11.4451 8.27177 11.4286 8.36106 11.4286 8.45125C11.4286 8.54144 11.4451 8.63073 11.4772 8.71398C11.5093 8.79723 11.5563 8.87279 11.6155 8.9363C11.6743 9.00034 11.7442 9.05116 11.8212 9.08584C11.8983 9.12053 11.9809 9.13838 12.0643 9.13838C12.1477 9.13838 12.2304 9.12053 12.3074 9.08584C12.3844 9.05116 12.4543 9.00034 12.5131 8.9363L14.9592 6.28558C15.3143 5.9013 15.5137 5.38038 15.5137 4.83725C15.5137 4.29413 15.3143 3.77321 14.9592 3.38892Z"
                fill="#F49E97"
              />
            </svg>
          </OutlineCircleButton>
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
                  <OutlineCircleButton className="bg-brightgray !border-transparent !text-charlestongreen">
                    Open
                    <svg
                      className="ml-3"
                      width="16"
                      height="10"
                      viewBox="0 0 16 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.9592 3.38892L12.5131 0.717707C12.4543 0.653674 12.3844 0.60285 12.3074 0.568166C12.2304 0.533482 12.1477 0.515625 12.0643 0.515625C11.9809 0.515625 11.8983 0.533482 11.8212 0.568166C11.7442 0.60285 11.6743 0.653674 11.6155 0.717707C11.4978 0.845708 11.4317 1.01886 11.4317 1.19935C11.4317 1.37983 11.4978 1.55298 11.6155 1.68098L13.8657 4.13358H0.977775C0.810139 4.13358 0.649369 4.20556 0.530833 4.33368C0.412296 4.4618 0.345703 4.63557 0.345703 4.81676C0.345703 4.99795 0.412296 5.17171 0.530833 5.29984C0.649369 5.42796 0.810139 5.49993 0.977775 5.49993H13.9036L11.6155 7.9662C11.5563 8.02971 11.5093 8.10526 11.4772 8.18852C11.4451 8.27177 11.4286 8.36106 11.4286 8.45125C11.4286 8.54144 11.4451 8.63073 11.4772 8.71398C11.5093 8.79723 11.5563 8.87279 11.6155 8.9363C11.6743 9.00034 11.7442 9.05116 11.8212 9.08584C11.8983 9.12053 11.9809 9.13838 12.0643 9.13838C12.1477 9.13838 12.2304 9.12053 12.3074 9.08584C12.3844 9.05116 12.4543 9.00034 12.5131 8.9363L14.9592 6.28558C15.3143 5.9013 15.5137 5.38038 15.5137 4.83725C15.5137 4.29413 15.3143 3.77321 14.9592 3.38892Z"
                        fill="#29292D"
                      />
                    </svg>
                  </OutlineCircleButton>
                </Link>
              ) : (
                <OutlineCircleButton className="flex items-center">
                  Downloading... {premChatPercentage}%
                  <Spinner className="ml-3 h-5 w-5" />
                </OutlineCircleButton>
              )
            ) : (
              <DownloadButton onClick={() => handleRunContainer()} />
            )}
          </AppCard>
          <AppCard
            icon={diffusionLogo}
            className="dashboard-bottom__card"
            title="Prem Michelangelo"
            description="The Best in Prompting"
          >
            <DownloadButton />
          </AppCard>
          <AppCard
            icon={premAgentLogo}
            className="dashboard-bottom__card"
            title="Prem Agent"
            description="The Best in Prompting"
          >
            <DownloadButton />
          </AppCard>
          <AppCard
            icon={copilotLogo}
            className="dashboard-bottom__card"
            title="Prem Copilot"
            description="The Best in Prompting"
          >
            <DownloadButton />
          </AppCard>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
