import clsx from "clsx";

const Beta = ({ className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <sup className={clsx("text-[9px] text-white ml-2", className)}>BETA</sup>;
};

export default Beta;
