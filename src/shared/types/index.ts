export type BotReplyProps = {
  reply: string;
};

export type DownloadDockerWallProps = {
  handleCheckIsDockerRunning: () => void;
};

export type ServicesCardProps = {
  title: string;
  className: string;
  icon: string;
};

export type SidebarProps = {
  sidebarToggle: boolean;
  setSidebarToggle: (value: boolean) => void;
};

export type SpinnerProps = {
  className?: string;
};

export type UserReplyProps = {
  reply: string;
};

export type DashboardIconPorps = {
  className: string;
};

export type ServiceIconPorps = {
  className: string;
};

export type PipelineIconProps = {
  className: string;
};

export type DocumentationIconProps = {
  className: string;
};

export type SettingIconProps = {
  className: string;
};

export type CloseIconProps = {
  className: string;
};
