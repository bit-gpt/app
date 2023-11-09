import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useGetService from "shared/hooks/useGetService";

import type { Service } from "../../service/types";

import PremAudioContainer from "./PremAudioContainer";

const PremAudio = () => {
  const { historyId, serviceId, serviceType } = useParams<{
    historyId: string;
    serviceId: Service["id"];
    serviceType: Service["serviceType"];
  }>();

  const { data: service, isLoading } = useGetService(serviceId!, serviceType!);

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremAudioContainer
      serviceName={service?.name ?? ""}
      historyId={historyId}
      serviceId={serviceId ?? ""}
      serviceType={serviceType ?? "docker"}
    />
  );
};

export default PremAudio;
