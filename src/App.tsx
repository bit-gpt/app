import AppRouter from "AppRouter";
import Onboarding from "modules/onboarding/components/Onboarding";
import { useEffect } from "react";
import Modal from "react-modal";
import { checkHasDnsRecord, isBrowserEnv } from "shared/helpers/utils";

import useSettingStore from "./shared/store/setting";

Modal.setAppElement("#root");

function App() {
  const isBrowser = isBrowserEnv();

  useEffect(() => {
    (async () => {
      const has = await checkHasDnsRecord();
      useSettingStore.getState().setHasDnsRecord(has);
    })();
  }, []);

  if (!isBrowser) {
    return <Onboarding redirectTo={<AppRouter />} />;
  }

  return <AppRouter />;
}

export default App;
