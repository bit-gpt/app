import { useMutation } from "@tanstack/react-query";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import StopIcon from "shared/components/StopIcon";
import stopService from "../api/stopService";

const RunningServiceState = ({ serviceId, refetch }: ServiceStateProps) => {

  const { mutate, isLoading } = useMutation((id: string) => stopService(id));

  const onStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate(serviceId, {
      onSuccess: refetch
    });
  };

  if (isLoading) {
    return <Spinner className="w-5 h-5" />;
  }

  return (
    <>
      <button
        className="border-[0.5px] border-brightgray text-white rounded-[3px] py-1 px-3 text-[10px] font-proximaNova-regular"
        onClick={(e) => e.preventDefault()}
      >
        Running
      </button>
      <button onClick={onStop}>
        <StopIcon />
      </button>
    </>
  );
};

export default RunningServiceState;
