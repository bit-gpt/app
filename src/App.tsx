import AppRouter from "AppRouter";
import Onboarding from "modules/onboarding/components/Onboarding";
import { useEffect } from "react";
import Modal from "react-modal";
import { isIP, isBrowserEnv } from "shared/helpers/utils";

import useSettingStore from "./shared/store/setting";

Modal.setAppElement("#root");

function App() {
  const isBrowser = isBrowserEnv();

  useEffect(() => {
    (async () => {
      const hostIsIP = isIP(window.location.host);
      // If not IP, then we assume it's a domain name
      useSettingStore.getState().setIsIP(hostIsIP);
    })();
  }, []);

  if (!isBrowser) {
    return <Onboarding redirectTo={<AppRouter />} />;
  }

  return <AppRouter />;
}

export default App;
