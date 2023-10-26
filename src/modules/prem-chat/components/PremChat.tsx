import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useGetService from "shared/hooks/useGetService";

import type { Service } from "../../service/types";

import PremChatContainer from "./PremChatContainer";

function PremChat() {
  const { chatId, serviceId, serviceType } = useParams<{
    chatId: string;
    serviceId: string;
    serviceType: Service["serviceType"];
  }>();

  const { data: service, isLoading } = useGetService(serviceId!, serviceType!);

  useEffect(() => {
    console.log("RUNNING", service?.name, service?.running);
  }, [service?.name, service?.running]);

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremChatContainer
      chatId={chatId}
      serviceName={service?.name ?? ""}
      serviceId={serviceId!}
      serviceType={serviceType!}
    />
  );
}

export default PremChat;
