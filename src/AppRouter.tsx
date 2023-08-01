import PremAudio from "modules/prem-audio/components/PremAudio";
import PremChat from "modules/prem-chat/components/PremChat";
import PremImage from "modules/prem-image/components/PremImage";
import PremTextAudio from "modules/prem-text-audio/components/PremTextAudio";
import PremUpscaler from "modules/prem-upscaler/components/PremUpscaler";
import Service from "modules/service/components/Service";
import ServiceDetail from "modules/service-detail/components/ServiceDetail";
import Settings from "modules/settings/components/Settings";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "shared/components/NotFound";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path="/prem-upscaler/:serviceId/:historyId?" element={<PremUpscaler />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" />
    </>
  );
};

export default AppRouter;
