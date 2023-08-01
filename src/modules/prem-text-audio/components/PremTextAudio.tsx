import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useService from "shared/hooks/useService";

import PremTextAudioContainer from "./PremTextAudioContainer";

const PremTextAudio = () => {
  const { historyId, serviceId } = useParams();

  const { data: response, isLoading } = useService(serviceId!, false);

  const service = response?.data;

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremTextAudioContainer
      serviceName={service?.name ?? ""}
      historyId={historyId}
      serviceId={serviceId!}
    />
  );
};

export default PremTextAudio;
