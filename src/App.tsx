import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkIsDockerRunning } from "./utils";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  const [isDockerRunning, setIsDockerRunning] = useState(false);

  useEffect(() => {
    checkIsDockerRunning().then((result) => {
      setIsDockerRunning(result);
    });    
  }, []);


  return (
    <Router>
      {isDockerRunning ? (
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      ) : (
        <div className="container">
          <h1>Docker not Detected</h1>
          <p>In order to run Prem App you need to have Docker installed and running. If you don't have Docker Desktop installed, you can go to the link below.</p>
          <div className="row">
            <button onClick={(e) => setIsDockerRunning(true)}>
              Download Docker Desktop
            </button>
          </div>
          <div className="row">
            <h3>Dependencies</h3>
          </div>
          <div className="row">
            <p>Docker</p>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
