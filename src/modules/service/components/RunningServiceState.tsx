import { useMutation } from "@tanstack/react-query";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import StopIcon from "shared/components/StopIcon";
import stopService from "../api/stopService";
import PrimaryButton from "shared/components/PrimaryButton";
import { toast } from "react-toastify";
import useStopService from "shared/hooks/useStopService";

const RunningServiceState = ({
  serviceId,
  refetch,
  isDetailView = false,
  onOpenClick,
}: ServiceStateProps) => {
  const { mutate, isLoading } = useStopService();

  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate(serviceId, {
      onSuccess: () => {
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
    onOpenClick && onOpenClick();
  };

  if (isLoading) {
    return (
      <div className="mt-2">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

  return (
    <>
      <button
        className="border-[0.5px] border-brightgray text-white rounded-[3px] py-1 px-3 text-[8px] font-proximaNova-regular"
        onClick={(e) => e.preventDefault()}
      >
        Running
      </button>
      <PrimaryButton
        className="!rounded-[14px] !px-4 !py-0 !text-[8px] !h-[21px] flex items-center"
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
