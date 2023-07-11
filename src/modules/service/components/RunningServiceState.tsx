import { ServiceStateProps } from "../types";
import PrimaryButton from "shared/components/PrimaryButton";
import useBodyLock from "shared/hooks/useBodyLock";

const RunningServiceState = ({ onOpenClick }: Pick<ServiceStateProps, "onOpenClick">) => {
  const { setBodyLocked } = useBodyLock();

  const onOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setBodyLocked(true);
    onOpenClick && onOpenClick();
  };

  return (
    <>
      <button
        className="border-[0.5px] border-brightgray text-white rounded-[3px] py-1 px-3 text-[10px] font-proximaNova-regular"
        onClick={(e) => e.preventDefault()}
      >
        Running
      </button>
      <PrimaryButton
        className="!rounded-[14px] !px-5 !py-0 !text-[10px] !h-[30px] flex items-center"
        onClick={onOpen}
      >
        Open
      </PrimaryButton>
    </>
  );
};

export default RunningServiceState;
