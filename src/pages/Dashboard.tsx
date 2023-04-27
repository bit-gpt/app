import { useEffect, useState } from "react";
import { Link, Route } from "react-router-dom";

import { runDockerContainer } from "../utils";
import AppCard from "../components/dashboard/AppCard";


function Dashboard() {
  const [runPremChatContainer, setRunPremChatContainer] = useState(false);
  const [isPremChatModelReady, setIsPremChatModelReady] = useState(false);
  const [premChatPercentage, setPremChatPercentage] = useState(0);

  const handleRunContainer = () => {
    runDockerContainer();
    setRunPremChatContainer(true);
  }

  useEffect(() => {
    async function fetchPremChatModelStatus (){
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/v1/status/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          setIsPremChatModelReady(true);
          console.log("Model ready to generate.");
        } else {
          try {
            const data = await response.json();
            console.log(`APIs are not ready yet! Amount completed ${data.percentate}%`);
            setPremChatPercentage(data.percentage);
          } catch (e) { 
            console.log(`APIs are not ready yet! ${e}`);
          }
          setTimeout(fetchPremChatModelStatus, 1000);
        }   
      } catch (e) {
        console.log(`Server not ready yet ${e}`);
        setTimeout(fetchPremChatModelStatus, 1000);
      }
    }
    fetchPremChatModelStatus();
  }, []);
  

  return (
    <div className="container">
      <h1>Prem.AI</h1>
      <h2 className="header-container">Your Own AGI in your Pocket.</h2>
      <p>Self-Sovereign & Composable AI infrastructure: empowering developers and organizations to own their own locally run AGI, accessed securely on your trustless and encrypted Premcloud</p>
      <button>Learn More about Prem</button>
      
      {/* Apps */}
      <div>
        <h3>Prem Chat</h3>
        <p>The Best in Prompting</p>
        {runPremChatContainer ? (
          isPremChatModelReady ? (
            <Link to="/prem-chat"> 
              <button>Start</button>
            </Link>) : (<p> Downloading... {premChatPercentage}% </p>)
        ): <div> <button onClick={(e) => handleRunContainer()}> Download </button></div>}
        
      </div>
      
      
      <AppCard title="Prem Michelangelo" description="The Best in Prompting"  />
      <AppCard title="Prem Agent" description="The Best in Prompting"  />
      <AppCard title="Prem Copilot" description="The Best in Prompting"  />
      
    </div>
  );
}

export default Dashboard;
