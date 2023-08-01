import { useState } from "react";
import useDocker from "shared/hooks/useDocker";
import useWelcomeScreen from "shared/hooks/useWelcomeScreen";

import type { OnboardingProps } from "../types";

import SystemCheck from "./SystemCheck";
import WelcomeScreen from "./WelcomeScreen";

const Onboarding = ({ redirectTo }: OnboardingProps) => {
  const { displayWelcomeScreen, setDisplayWelcomeScreen, closeWelcomeScreen } = useWelcomeScreen();
  const { isDockerRunning, isContainerRunning, isServerRunning, handleCheckIsDockerRunning } =
    useDocker();

  const [isSystemChecked, setIsSystemChecked] = useState(false);

  const isSystemCheckRequired =
    !isDockerRunning || !isContainerRunning || !isServerRunning || !isSystemChecked;

  if (displayWelcomeScreen) {
    return <WelcomeScreen close={closeWelcomeScreen} />;
  }

  if (isSystemCheckRequired) {
    return (
      <SystemCheck
        handleCheckIsDockerRunning={handleCheckIsDockerRunning}
        isDockerRunning={isDockerRunning}
        isServerRunning={isServerRunning && isContainerRunning}
        back={() => setDisplayWelcomeScreen(true)}
        next={() => setIsSystemChecked(true)}
      />
    );
  }

  return redirectTo;
};

export default Onboarding;
