import { ServicesCardProps } from "shared/types";
import DeleteIcon from "./DeleteIcon";
import StopIcon from "./StopIcon";
import PlayIcon from "./PlayIcon";

const ServicesCard = ({
  title,
  className,
  icon,
  isRunning,
  onStart,
  onStop,
  onDelete,
}: ServicesCardProps) => {
  return (
    <div className={className}>
      <div className="flex gap-8 items-start flex-wrap w-full z-10 relative">
        <div className="dashboard-bottom__card-box">
          <img src={icon} alt="icon" />
        </div>
        <div className="flex gap-4 xl:ml-auto">
          {isRunning && (
            <>
              <button className="border-[0.5px] border-brightgray rounded-[3px] py-1 px-3 text-[10px] font-proximaNova-regular">
                Running
              </button>
              <button onClick={onStop}>
                <StopIcon />
              </button>
            </>
          )}
          {!isRunning && (
            <button onClick={onStart}>
              <PlayIcon />
            </button>
          )}
          <button onClick={onDelete}>
            <DeleteIcon />
          </button>
        </div>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default ServicesCard;
