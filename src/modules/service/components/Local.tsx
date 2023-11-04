import clsx from "clsx";

const Local = ({ className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <sup className={clsx("text-[11px] text-white", className)}>🖥️ MY COMPUTER</sup>;
};

export default Local;
