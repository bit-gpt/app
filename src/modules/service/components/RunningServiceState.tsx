import PrimaryButton from "shared/components/PrimaryButton";
import { useLockedBody } from "usehooks-ts";

import type { ServiceStateProps } from "../types";

const RunningServiceState = ({ onOpenClick }: Pick<ServiceStateProps, "onOpenClick">) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setBodyLocked] = useLockedBody(false, "root");

  const onOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setBodyLocked(true);
    onOpenClick?.();
  };

  return (
    <>
      <button
        className="border-[0.5px] border-grey-300 text-white rounded-[3px] py-1 px-3 text-[10px] "
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
