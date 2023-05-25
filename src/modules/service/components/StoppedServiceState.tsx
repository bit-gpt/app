import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVICES_KEY } from "shared/hooks/useServices";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import deleteService from "../api/deleteService";
import startService from "../api/startService";
import PlayIcon from "shared/components/PlayIcon";
import DeleteIcon from "shared/components/DeleteIcon";
import { useState } from "react";
import WarningModal from "./WarningModal";

const StoppedServiceState = ({ serviceId }: ServiceStateProps) => {
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation(
    (id: string) => deleteService(id)
  );

  const { mutate: startMutate, isLoading: startLoading } = useMutation(
    (id: string) => startService(id)
  );

  const onStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startMutate(serviceId, {
      onSuccess: () => {
        queryClient.refetchQueries([SERVICES_KEY]);
      },
    });
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(true);
  };

  const deleteServiceHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
    deleteMutate(serviceId, {
      onSuccess: () => {
        queryClient.refetchQueries([SERVICES_KEY]);
      },
    });
  };

  const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
  };

  if (deleteLoading || startLoading) {
    return <Spinner className="w-5 h-5" />;
  }

  return (
    <>
      <button onClick={onStart}>
        <PlayIcon />
      </button>
      <button onClick={onDelete}>
        <DeleteIcon />
      </button>
      {openDeleteModal && (
        <WarningModal
        icon={<DeleteIcon />}
          description="Are you sure you want to remove this service from your list?"
          okButtonText="Yes"
          title="Warning"
          onCancel={onCancelClick}
          onOk={deleteServiceHandler}
        />
      )}
    </>
  );
};

export default StoppedServiceState;
