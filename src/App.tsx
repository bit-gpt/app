import AppRouter from "AppRouter";
import Onboarding from "modules/onboarding/components/Onboarding";
import Modal from "react-modal";
import { isBrowserEnv } from "shared/helpers/utils";

Modal.setAppElement("#root");

function App() {
  const isBrowser = isBrowserEnv();

  if (!isBrowser) {
    return <Onboarding redirectTo={<AppRouter />} />;
  }

  return <AppRouter />;
}

export default App;
