import clsx from "clsx";

const PremNetwork = ({ className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <sup className={clsx("text-[11px] text-white", className)}>📡 PREM NETWORK</sup>;
};

export default PremNetwork;
