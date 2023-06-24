import { useMutation } from "@tanstack/react-query";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";
import deleteService from "../api/deleteService";
import DeleteIcon from "shared/components/DeleteIcon";
import { useState } from "react";
import WarningModal from "./WarningModal";
import PrimaryButton from "shared/components/PrimaryButton";
import { toast } from "react-toastify";
import useStartService from "shared/hooks/useStartService";
import useBodyLock from "shared/hooks/useBodyLock";

const StoppedServiceState = ({
  serviceId,
  refetch,
  isDetailView,
  onOpenClick,
}: ServiceStateProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { bodyLocked, setBodyLocked } = useBodyLock();

  const { mutate: deleteMutate, isLoading: deleteLoading } = useMutation((id: string) =>
    deleteService(id)
  );

  const { mutate: startMutate, isLoading: startLoading } = useStartService();

  const onStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startMutate(serviceId, {
      onSuccess: () => {
        refetch();
        onOpenClick && onOpenClick();
        toast.success("Service started successfully");
      },
      onError: () => {
        toast.error("Failed to start service");
      },
    });
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(true);
    setBodyLocked(true);
  };

  const deleteServiceHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
    deleteMutate(serviceId, {
      onSuccess: () => {
        refetch();
        toast.success("Service deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete service");
      },
    });
  };

  const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
    setBodyLocked(false);
  };

  if (deleteLoading || startLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

  return (
    <>
      <PrimaryButton
        className="!rounded-[14px] !px-5 !py-0 !text-[10px] !h-[30px] flex items-center"
        onClick={onStart}
      >
        Open
      </PrimaryButton>
      {isDetailView && (
        <button onClick={onDelete}>
          <DeleteIcon />
        </button>
      )}
      {openDeleteModal && (
        <WarningModal
          icon={<DeleteIcon />}
          description="Are you sure you want to remove this service from your list?"
          okButtonText="Yes"
          title="Warning"
          onCancel={onCancelClick}
          onOk={deleteServiceHandler}
          isOpen={openDeleteModal}
        />
      )}
    </>
  );
};

export default StoppedServiceState;
