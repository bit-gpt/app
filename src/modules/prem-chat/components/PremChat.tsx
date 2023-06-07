import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useService from "shared/hooks/useService";
import startService from "modules/service/api/startService";
import Spinner from "shared/components/Spinner";
import AppContainer from "shared/components/AppContainer";
import PremChatContainer from "./PremChatContainer";

function PremChat() {
  const { chatId, serviceId } = useParams();

  const { data: response, isLoading } = useService(serviceId!);
  const service = response?.data;

  useEffect(() => {
    if (service && !service?.running) {
      startService(serviceId!);
    }
  }, [service]);

  if (isLoading) {
    return (
      <AppContainer>
        <div className="flex items-center h-full justify-center mt-5">
          <Spinner className="h-10 w-10" />
        </div>
      </AppContainer>
    );
  }

  return (
    <PremChatContainer
      chatId={chatId}
      serviceName={service?.name!}
      serviceId={serviceId!}
      isStreaming={service?.modelInfo.streaming!}
    />
  );
}

export default PremChat;
