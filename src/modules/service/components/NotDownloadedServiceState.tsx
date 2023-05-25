import { useMutation } from "@tanstack/react-query";
import downloadService from "../api/downloadService";
import DownloadIcon from "shared/components/DownloadIcon";
import Spinner from "shared/components/Spinner";
import { ServiceStateProps } from "../types";

const NotDownloadedServiceState = ({
  serviceId,
  refetch,
}: ServiceStateProps) => {
  const { mutate, isLoading } = useMutation((id: string) =>
    downloadService(id)
  );

  const onDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate(serviceId, {
      onSuccess: refetch,
    });
  };

  if (isLoading) {
    return <Spinner className="w-5 h-5" />;
  }

  return (
    <button onClick={onDownload}>
      <DownloadIcon />
    </button>
  );
};

export default NotDownloadedServiceState;
