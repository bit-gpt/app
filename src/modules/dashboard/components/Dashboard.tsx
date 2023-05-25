import { useState } from "react";
import clsx from "clsx";

import OutlineCircleButton from "shared/components/OutlineCircleButton";
import AppContainer from "shared/components/AppContainer";
import ServicesRunning from "./ServicesRunning";
import Apps from "./Apps";

function Dashboard() {
  return (
    <AppContainer>
      <Apps />
      <ServicesRunning />
    </AppContainer>
  );
}

export default Dashboard;
