import { useParams } from "react-router-dom";
import useService from "shared/hooks/useService";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import PremUpscalerContainer from "./PremUpscalerContainer";

const PremUpscaler = () => {
  const { historyId, serviceId } = useParams();

  const { data: response, isLoading } = useService(serviceId!, false);

  const service = response?.data;

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremUpscalerContainer
      serviceName={service?.name!}
      historyId={historyId}
      serviceId={serviceId!}
    />
  );
};

export default PremUpscaler;
