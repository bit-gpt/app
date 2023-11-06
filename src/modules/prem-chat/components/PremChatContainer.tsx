import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import BotReply from "shared/components/BotReply";
import UserReply from "shared/components/UserReply";
import usePremChatStream from "shared/hooks/usePremChatStream";
import { useMediaQuery, useWindowSize } from "usehooks-ts";

import type { Message, PremChatContainerProps } from "../types";

import Header from "./Header";
import InputBox from "./InputBox";
import PremChatSidebar from "./PremChatSidebar";
import RegenerateButton from "./RegenerateButton";
import RightSidebar from "./RightSidebar";

const PremChatContainer = ({
  chatId,
  serviceId,
  serviceType,
  serviceName,
}: PremChatContainerProps) => {
  const model = serviceId;
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const chatMessageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { height } = useWindowSize();
  const responsiveMatches = useMediaQuery("(min-width: 768px)");
  const headerRef = useRef(null);
  const [headerVisibleHeight, setHeaderVisibleHeight] = useState(0);

  const {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
    resetPromptTemplate,
    resetChatServiceUrl,
    abort,
  } = usePremChatStream(serviceId, serviceType, chatId || null);

  const handleScroll = () => {
    if (headerRef.current) {
      const rect = (headerRef.current as any).getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      setHeaderVisibleHeight(visibleHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      <div className="md:flex w-full relative">
        <div
          className={clsx("flex flex-col prem-chat-sidebar md:relative", {
            "max-md:hidden": hamburgerMenuOpen,
          })}
        >
          <PremChatSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1 prem-chat-container">
          <div className="bg-lines bg-grey-900 relative h-full w-full">
            <div
              className="main-content h-screen z-10 relative overflow-hidden scrollbar-none"
              ref={chatMessageListRef}
            >
              <Header
                ref={headerRef}
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div
                className="z-10 relative flex flex-col prem-chat-body scrollbar-none"
                style={{ height: height - headerVisibleHeight - (responsiveMatches ? 215 : 120) }}
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
                <div className="md:w-[55%] sm:w-[85%] w-[88%] mx-auto mt-4">
                  {chatMessages.length > 0 && !isLoading && !isError && (
                    <RegenerateButton onRgenerateClick={onRegenerate} />
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
              resetChatServiceUrl={resetChatServiceUrl}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PremChatContainer;
