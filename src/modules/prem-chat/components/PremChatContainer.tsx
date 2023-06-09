import { useEffect, useRef, useState } from "react";
import UserReply from "shared/components/UserReply";
import BotReply from "shared/components/BotReply";
import usePremChat from "shared/hooks/usePremChat";
import InputBox from "./InputBox";
import PremChatSidebar from "./PremChatSidebar";
import RegenerateButton from "./RegenerateButton";
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import { Message, PremChatContainerProps } from "../types";
import clsx from "clsx";

const PremChatContainer = ({
  chatId,
  isStreaming,
  serviceId,
  serviceName,
}: PremChatContainerProps) => {
  const model = serviceId;
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const chatMessageListRef = useRef<HTMLDivElement>(null);

  const { chatMessages, onSubmit, question, setQuestion, isLoading, isError, onRegenerate } =
    usePremChat(isStreaming, serviceId!, chatId || null);

  useEffect(() => {
    if (chatMessageListRef.current) {
      chatMessageListRef.current.scrollTop = chatMessageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <section>
      <div className="flex h-screen w-full relative">
        <div className={clsx("prem-chat-sidebar", hamburgerMenuOpen && "max-md:hidden")}>
          <PremChatSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div
              className="main-content h-full z-10 relative max-h-full overflow-x-hidden max-md:overflow-hidden scrollbar-none"
              ref={chatMessageListRef}
            >
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>{rightSidebar && <RightSidebar setRightSidebar={setRightSidebar} />}</div>
      </div>
    </section>
  );
};

export default PremChatContainer;
