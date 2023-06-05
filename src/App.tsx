import Modal from "react-modal";
import Onboarding from "modules/onboarding/components/Onboarding";
import { isBrowserEnv } from "shared/helpers/utils";
import AppRouter from "AppRouter";

Modal.setAppElement("#root");

function App() {
  const isBrowser = isBrowserEnv();

  if (!isBrowser) {
    return <Onboarding redirectTo={<AppRouter />} />;
  }

  return <AppRouter />;
}

export default App;
