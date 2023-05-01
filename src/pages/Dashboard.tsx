import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStatus } from "../shared/api";
import { runDockerContainer } from "../utils";
import AppCard from "../components/dashboard/AppCard";
import { AxiosError } from "axios";

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
    <div className="container">
      <h1>Prem.AI</h1>
      <h2 className="header-container">Your Own AGI in your Pocket.</h2>
      <p>
        Self-Sovereign & Composable AI infrastructure: empowering developers and
        organizations to own their own locally run AGI, accessed securely on
        your trustless and encrypted Premcloud
      </p>
      <button>Learn More about Prem</button>

      {/* Apps */}

      <AppCard title="Prem Chat" description="The Best in Prompting">
        {runPremChatContainer ? (
          isPremChatModelReady ? (
            <Link to="/prem-chat">
              <button>Start</button>
            </Link>
          ) : (
            <p> Downloading... {premChatPercentage}% </p>
          )
        ) : (
          <div>
            <button onClick={(e) => handleRunContainer()}> Download </button>
          </div>
        )}
      </AppCard>

      <AppCard title="Prem Michelangelo" description="The Best in Prompting">
        <button> Download </button>
      </AppCard>
      <AppCard title="Prem Agent" description="The Best in Prompting">
        <button> Download </button>
      </AppCard>
      <AppCard title="Prem Copilot" description="The Best in Prompting">
        <button> Download </button>
      </AppCard>
    </div>
  );
}

export default Dashboard;
