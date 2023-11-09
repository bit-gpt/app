import Send from "assets/images/send.svg";
import { useEffect, useRef, useState } from "react";
import BotReply from "shared/components/BotReply";
import UserReply from "shared/components/UserReply";
import usePremChatStream from "shared/hooks/usePremChatStream";
import { useMediaQuery, useWindowSize } from "usehooks-ts";

import Spinner from "../../../shared/components/Spinner";
import useAutosizeTextArea from "../../../shared/hooks/useAutosizeTextarea";
import type { Message, PremChatContainerProps } from "../types";

import Header from "./Header";
import PremChatSidebar from "./PremChatSidebar";
import RegenerateButton from "./RegenerateButton";
import RightSidebar from "./RightSidebar";

const PremChatContainer = ({
  historyId,
  serviceId,
  serviceType,
  serviceName,
  isPetals,
}: PremChatContainerProps) => {
  const model = serviceId;
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const chatMessageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
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
  } = usePremChatStream(serviceId, serviceType, historyId || null);

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

  useAutosizeTextArea(textAreaRef.current, question);

  useEffect(() => {
    if (chatMessageListRef.current) {
      chatMessageListRef.current.scrollTop = chatMessageListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!isLoading && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isLoading]);

  // abort chat request on unmount
  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort, historyId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for 'Enter' key without 'Shift'
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line from being added
      onSubmit(e); // Calls your submit function
    }
    // If 'Shift' + 'Enter' is pressed, let the default behavior occur, which is to add a new line
  };

  return (
    <section>
      <div className="md:flex w-full relative">
        <PremChatSidebar
          hamburgerMenuOpen={hamburgerMenuOpen}
          setHamburgerMenu={setHamburgerMenu}
          serviceId={serviceId}
          serviceType={serviceType}
          historyId={historyId ?? ""}
        />
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
                isPetals={isPetals}
              />
              <div
                className="z-10 relative flex flex-col prem-chat-body scrollbar-none"
                style={{
                  height:
                    height -
                    headerVisibleHeight -
                    (responsiveMatches ? (isPetals ? 215 : 160) : 120),
                }}
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
                    <RegenerateButton onRegenerateClick={onRegenerate} />
                  )}
                  <form onSubmit={onSubmit}>
                    <div className="autosize-textarea-container">
                      <textarea
                        autoComplete="off"
                        className="autosize-textarea"
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                          isLoading
                            ? "Fetching response..."
                            : model
                            ? `Type a message or type "/" to select a prompt`
                            : "Please select a model to get started"
                        }
                        ref={textAreaRef}
                        rows={1}
                        value={question}
                        disabled={isLoading || !model}
                      />
                      <button>
                        {isLoading ? (
                          <Spinner className="h-9 w-5" />
                        ) : (
                          <img src={Send} alt="send" />
                        )}
                      </button>
                    </div>
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
