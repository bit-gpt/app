import PremChat from "modules/prem-chat/components/PremChat";
import ServiceDetail from "modules/service-detail/components/ServiceDetail";
import Service from "modules/service/components/Service";
import Settings from "modules/settings/components/Settings";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "shared/components/NotFound";
import { ToastContainer } from "react-toastify";
import PremImage from "modules/prem-image/components/PremImage";
import "react-toastify/dist/ReactToastify.css";
import PremAudio from "modules/prem-audio/components/PremAudio";
import PremTextAudio from "modules/prem-text-audio/components/PremTextAudio";

const AppRouter = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Service />} />
          <Route path="/prem-chat/:serviceId/:chatId?" element={<PremChat />} />
          <Route path="/services/:serviceId/detail" element={<ServiceDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/prem-image/:serviceId/:historyId?" element={<PremImage />} />
          <Route path="/prem-audio/:serviceId/:historyId?" element={<PremAudio />} />
          <Route path="/prem-text-audio/:serviceId/:historyId?" element={<PremTextAudio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" />
    </>
  );
};

export default AppRouter;
