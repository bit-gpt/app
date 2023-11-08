import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useGetService from "shared/hooks/useGetService";

import type { Service } from "../../service/types";

import PremTextAudioContainer from "./PremTextAudioContainer";

const PremTextAudio = () => {
  const { historyId, serviceId, serviceType } = useParams<{
    historyId: string;
    serviceId: string;
    serviceType: Service["serviceType"];
  }>();

  const { data: service, isLoading } = useGetService(serviceId!, serviceType!);

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremTextAudioContainer
      serviceName={service?.name ?? ""}
      historyId={historyId}
      serviceId={serviceId ?? ""}
      serviceType={serviceType ?? "docker"}
    />
  );
};

export default PremTextAudio;
