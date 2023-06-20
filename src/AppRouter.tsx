import PremChat from "modules/prem-chat/components/PremChat";
import ServiceDetail from "modules/service-detail/components/ServiceDetail";
import Service from "modules/service/components/Service";
import Settings from "modules/settings/components/Settings";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotFound from "shared/components/NotFound";
import { ToastContainer } from "react-toastify";
import PremImage from "modules/prem-image/components/PremImage";
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
          <Route path="/prem-image" element={<PremImage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" />
    </>
  );
};

export default AppRouter;
