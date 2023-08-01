import { useState } from "react";
import { toast } from "react-toastify";
import PrimaryButton from "shared/components/PrimaryButton";
import Spinner from "shared/components/Spinner";
import StopIcon from "shared/components/StopIcon";
import useBodyLock from "shared/hooks/useBodyLock";
import useStopService from "shared/hooks/useStopService";

import type { ServiceStateProps } from "../types";

const RunningServiceState = ({
  serviceId,
  refetch,
  isDetailView = false,
  onOpenClick,
}: ServiceStateProps) => {
  const { mutate, isLoading } = useStopService();
  const { setBodyLocked } = useBodyLock();
  const [refresh, setRefresh] = useState(false);

  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate(serviceId, {
      onSuccess: () => {
        setRefresh(true);
        refetch();
        toast.success("Service stopped successfully");
      },
      onError: () => {
        toast.error("Failed to stop service");
      },
    });
  };

  const onOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setBodyLocked(true);
    onOpenClick?.();
  };

  if (isLoading || refresh) {
    return (
      <div className="mt-2">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

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
      {isDetailView && (
        <button onClick={onStop}>
          <StopIcon />
        </button>
      )}
    </>
  );
};

export default RunningServiceState;
