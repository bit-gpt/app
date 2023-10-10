import { useState } from "react";

import type { OnboardingProps } from "../types";

import WelcomeScreen from "./WelcomeScreen";

const Onboarding = ({ redirectTo }: OnboardingProps) => {
  const [displayWelcomeScreen, setDisplayWelcomeScreen] = useState(true);

  if (displayWelcomeScreen) {
    return <WelcomeScreen close={() => setDisplayWelcomeScreen(false)} />;
  }

  return redirectTo;
};

export default Onboarding;
