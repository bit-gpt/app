import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useGetService from "shared/hooks/useGetService";

import type { Service } from "../../service/types";

import PremChatContainer from "./PremChatContainer";

function PremChat() {
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
    <PremChatContainer
      historyId={historyId}
      serviceName={service?.name ?? ""}
      serviceId={serviceId ?? ""}
      serviceType={serviceType ?? "docker"}
      isPetals={service?.petals ?? false}
    />
  );
}

export default PremChat;
