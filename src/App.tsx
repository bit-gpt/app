import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PremChat from "./pages/PremChat";
import DownloadDockerWall from "./shared/components/DownloadDockerWall";
import NotFound from "./shared/components/NotFound";
import useDocker from "./shared/hooks/useDocker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isDesktopEnv } from "./utils";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
