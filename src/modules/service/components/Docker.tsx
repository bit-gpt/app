import clsx from "clsx";

const Docker = ({ className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <sup className={clsx("text-[11px] text-white", className)}>🐳 DOCKER</sup>;
};

export default Docker;
