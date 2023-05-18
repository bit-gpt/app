export type App = {
  id: string;
  name: string;
  icon: string;
  playground: boolean;
  documentation: string;
};

export type AppCardProps = {
  title: string;
  className: string;
  icon: string;
};

export type DownloadButtonProps = {
  onClick?: () => void;
};
