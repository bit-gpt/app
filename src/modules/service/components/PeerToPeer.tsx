import clsx from "clsx";

const PeerToPeer = ({ className }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <sup className={clsx("text-[11px] text-white font-bold", className)}>🍐 PEER TO PEER</sup>;
};

export default PeerToPeer;
