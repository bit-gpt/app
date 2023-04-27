import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PremChat from "./pages/PremChat";
import DownloadDockerWall from "./shared/components/DownloadDockerWall";
import NotFound from "./shared/components/NotFound";
import useDocker from "./hooks/useDocker";

function App() {
  const { isDockerRunning, handleCheckIsDockerRunning } = useDocker();

  if (!isDockerRunning) {
    return (
      <DownloadDockerWall
        handleCheckIsDockerRunning={handleCheckIsDockerRunning}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/prem-chat" element={<PremChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
