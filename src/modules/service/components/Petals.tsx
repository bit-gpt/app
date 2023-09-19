import clsx from "clsx";

const Petals = ({ className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <sup className={clsx("text-[9px] text-white ml-2", className)}>PETALS</sup>;
};

export default Petals;
