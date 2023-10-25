import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useGetService from "shared/hooks/useGetService";

import ServiceController from "../../../controller/serviceController";
import type { Service } from "../../service/types";

import PremChatContainer from "./PremChatContainer";

function PremChat() {
  const { chatId, serviceId, serviceType } = useParams<{
    chatId: string;
    serviceId: string;
    serviceType: Service["serviceType"];
  }>();

  const { data: service, isLoading, refetch } = useGetService(serviceId!, serviceType!);

  useEffect(() => {
    (async () => {
      if (service && !service?.running) {
        const controller = ServiceController.getInstance();
        await controller.start(serviceId!, service.serviceType);
        await refetch();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

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
