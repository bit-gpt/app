import { useParams } from "react-router-dom";
import PremImageContainer from "./PremImageContainer";
import useService from "shared/hooks/useService";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";

const PremImage = () => {
  const { historyId, serviceId } = useParams();

  const { data: response, isLoading } = useService(serviceId!, false);

  const service = response?.data;

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremImageContainer serviceName={service?.name!} historyId={historyId} serviceId={serviceId!} />
  );
};

export default PremImage;
