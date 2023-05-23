import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import NotFound from "shared/components/NotFound";
import useDocker from "shared/hooks/useDocker";
import DownloadDockerWall from "shared/components/DownloadDockerWall";
import { isDesktopEnv } from "shared/helpers/utils";

import Dashboard from "modules/dashboard/components/Dashboard";
import PremChat from "modules/prem-chat/components/PremChat";
import Service from "modules/service/components/Service";
import Settings from "modules/settings/components/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isDockerRunning, handleCheckIsDockerRunning } = useDocker();
  const isDesktop = isDesktopEnv();

  if (isDesktop && !isDockerRunning) {
    return (
      <DownloadDockerWall
        handleCheckIsDockerRunning={handleCheckIsDockerRunning}
        isDockerRunning={isDockerRunning}
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/prem-chat" element={<PremChat />} />
          <Route path="/prem-chat/:chatId" element={<PremChat />} />
          <Route path="/services" element={<Service />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/:appId/services" element={<Service />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
