import { toast } from "react-toastify";
import DeleteIcon from "shared/components/DeleteIcon";
import PrimaryButton from "shared/components/PrimaryButton";
import Spinner from "shared/components/Spinner";
import useStartService from "shared/hooks/useStartService";

import useDeleteService from "../../../shared/hooks/useDeleteService";
import type { ServiceStateProps } from "../types";

import WarningModal from "./WarningModal";

type DeleteModalProps = {
  openDeleteModal: boolean;
  setOpenDeleteModal: (value: boolean) => void;
  setBodyLocked: (value: boolean) => void;
};

const StoppedServiceState = ({
  service,
  refetch,
  onOpenClick,
  openDeleteModal,
  setOpenDeleteModal,
  isDetailView,
}: ServiceStateProps & DeleteModalProps) => {
  const { mutate: deleteMutate, isPending: isDeletePending } = useDeleteService();
  const { mutateAsync: startMutateAsync, isPending: isStartPending } = useStartService();

  const onStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await startMutateAsync({ serviceId: service.id, serviceType: service.serviceType });
      refetch();
      onOpenClick?.();
      toast.success("Service started successfully");
    } catch (error) {
      toast.error("Failed to start service");
    }
  };

  const deleteServiceHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
    deleteMutate(
      { serviceId: service.id, serviceType: service.serviceType },
      {
        onSuccess: () => {
          refetch();
          toast.success("Service deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete service");
        },
      },
    );
  };

  const onCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenDeleteModal(false);
    //setBodyLocked(false);
  };

  if (isDeletePending || isStartPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

  return (
    <>
      {isDetailView && (
        <PrimaryButton
          className="!rounded-[14px] !px-5 !py-0 !text-[10px] !h-[30px] flex items-center"
          onClick={onStart}
        >
          Open
        </PrimaryButton>
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
