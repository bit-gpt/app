import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserReply from "shared/components/UserReply";
import BotReply from "shared/components/BotReply";
import usePremChat from "shared/hooks/usePremChat";

import InputBox from "./InputBox";
import PremChatSidebar from "./PremChatSidebar";
import RegenerateButton from "./RegenerateButton";
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import { Message } from "../types";
import useService from "shared/hooks/useService";
import startService from "modules/service/api/startService";

function PremChat() {
  const { chatId, serviceId } = useParams();
  const model = serviceId;
  const [rightSidebar, setRightSidebar] = useState(false);
  const chatMessageListRef = useRef<HTMLDivElement>(null);
  const { data: response } = useService(serviceId!);
  const service = response?.data;

  const {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
  } = usePremChat(serviceId!, chatId || null);

  useEffect(() => {
    if (!service?.running) {
      startService(serviceId!);
    }

    if (chatMessageListRef.current) {
      chatMessageListRef.current.scrollTop =
        chatMessageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <section>
      <div className="flex md:flex-wrap h-screen w-full relative">
        <div className="prem-chat-sidebar">
          <PremChatSidebar />
        </div>
        <div className="flex sm:flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div
              className="main-content h-full z-10 relative max-h-full overflow-x-hidden scrollbar-none"
              ref={chatMessageListRef}
            >
              <Header
                title={service?.name || ""}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div className="z-10 relative mt-[40px] flex flex-col prem-chat-body">
                <div className="md:w-[65%] w-[90%] mx-auto mt-8">
                  {chatMessages.map((message: Message, index: number) => (
                    <div key={index}>
                      {message.role === "user" ? (
                        <UserReply reply={message.content} />
                      ) : (
                        <BotReply reply={message.content} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="prem-chat-bottom border-transparent bg-gradient-to-b from-transparent via-white to-white dark:via-[#20232B] dark:to-[#20232B]">
                  <div className="md:w-[55%] w-[85%] mx-auto">
                    {chatMessages.length > 0 && !isLoading && !isError && (
                      <div>
                        <RegenerateButton onRgenerateClick={onRegenerate} />
                      </div>
                    )}
                    <form className="text-center" onSubmit={onSubmit}>
                      <InputBox
                        question={question}
                        setQuestion={setQuestion}
                        disabled={isLoading || !model}
                        placeholder={
                          isLoading
                            ? "Fetching response..."
                            : model
                            ? "Type a message or type to select a prompt"
                            : "Please select a model to get started"
                        }
                      />
                    </form>
                    <p className="text-philippinegray mt-3 text-[10px] font-proximaNova-regular text-center">
                      ChatBot UI. Chat bot UI is an advanced chatbot kit for
                      OpenAI'a chat models aiming to mimic ChatGPT's interface
                      and functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {rightSidebar && <RightSidebar setRightSidebar={setRightSidebar} />}
        </div>
      </div>
    </section>
  );
}

export default PremChat;
