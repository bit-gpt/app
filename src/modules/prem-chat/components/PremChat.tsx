import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useService from "shared/hooks/useService";
import startService from "modules/service/api/startService";
import PremChatContainer from "./PremChatContainer";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";

function PremChat() {
  const { chatId, serviceId } = useParams();

  const { data: response, isLoading } = useService(serviceId!, false);
  const service = response?.data;

  useEffect(() => {
    if (service && !service?.running) {
      startService(serviceId!);
    }
  }, [service, serviceId]);

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return <PremChatContainer chatId={chatId} serviceName={service?.name!} serviceId={serviceId!} />;
}

export default PremChat;
