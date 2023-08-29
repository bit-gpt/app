import type { ReactElement } from "react";

export type WelcomeScreenProps = {
  close: () => void;
};

export type SystemCheckProps = {
  handleCheckIsDockerRunning: () => Promise<void>;
  isDockerRunning: boolean;
  isServerRunning: boolean;
  back: () => void;
  next: () => void;
};

export type DependencyProps = {
  isRunning: boolean;
  name: string;
  status: string;
  tooltip?: string | ReactElement;
  id: string | number;
  isLoading?: boolean;
};

export type OnboardingProps = {
  redirectTo: ReactElement;
};
