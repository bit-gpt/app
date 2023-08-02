import startService from "modules/service/api/startService";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayGroundSpinner from "shared/components/PlayGroundSpinner";
import useService from "shared/hooks/useService";

import PremChatContainer from "./PremChatContainer";

function PremChat() {
  const { chatId, serviceId } = useParams();

  const { data: response, isLoading } = useService(serviceId!, false);
  const service = response?.data;

  useEffect(() => {
    if (service && !service?.running) {
      startService(serviceId!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <PremChatContainer chatId={chatId} serviceName={service?.name ?? ""} serviceId={serviceId!} />
  );
}

export default PremChat;
