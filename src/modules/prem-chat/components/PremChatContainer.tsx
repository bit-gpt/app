import { useEffect, useRef, useState } from "react";
import UserReply from "shared/components/UserReply";
import BotReply from "shared/components/BotReply";
import InputBox from "./InputBox";
import PremChatSidebar from "./PremChatSidebar";
import RegenerateButton from "./RegenerateButton";
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import { Message, PremChatContainerProps } from "../types";
import clsx from "clsx";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import usePremChatStream from "shared/hooks/usePremChatStream";

const PremChatContainer = ({ chatId, serviceId, serviceName }: PremChatContainerProps) => {
  const model = serviceId;
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const chatMessageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { height } = useWindowSize();
  const responsiveMatches = useMediaQuery("(min-width: 768px)");

  const {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
    resetPromptTemplate,
    abort,
  } = usePremChatStream(serviceId, chatId || null);

  useEffect(() => {
    if (chatMessageListRef.current) {
      chatMessageListRef.current.scrollTop = chatMessageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // abort chat request on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort, chatId]);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div className={clsx("prem-chat-sidebar md:relative", hamburgerMenuOpen && "maxMd:hidden")}>
          <PremChatSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1 prem-chat-container">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div
              className="main-content h-full z-10 relative max-h-full overflow-hidden scrollbar-none"
              ref={chatMessageListRef}
            >
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div
                className="z-10 relative md:mt-[40px] mt-0 flex flex-col prem-chat-body scrollbar-none"
                style={{ height: height - (responsiveMatches ? 200 : 100) }}
              >
                <div className="md:w-[65%] w-[90%] mx-auto md:mt-8">
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
              </div>
              <div className="prem-chat-bottom border-transparent">
                <div className="md:w-[55%] sm:w-[85%] w-[88%] mx-auto maxMd:mt-[14px]">
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
                      ref={inputRef}
                      placeholder={
                        isLoading
                          ? "Fetching response..."
                          : model
                          ? `Type a message or type "/" to select a prompt`
                          : "Please select a model to get started"
                      }
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {rightSidebar && (
            <RightSidebar
              setRightSidebar={setRightSidebar}
              resetPromptTemplate={resetPromptTemplate}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PremChatContainer;
