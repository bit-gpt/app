import { useMemo, useState } from "react";
import InputBox from "../components/prem-chat/InputBox";
import ModelSelectionDropdown from "../components/prem-chat/ModelSelectionDropdown";
import UserReply from "../shared/components/UserReply";
import BotReply from "../shared/components/BotReply";
import usePremChat from "../shared/hooks/usePremChat";
import Sidebar from "../components/prem-chat/Sidebar";
import { useParams } from "react-router-dom";
import RegenerateButton from "../components/prem-chat/RegenerateButton";
import Header from "../components/prem-chat/Header";
import RightSidebar from "../components/prem-chat/RightSidebar";

import usePremChatStore from "../shared/store/prem-chat";

function PremChat() {
  const { chatId } = useParams();
  const model = usePremChatStore((state) => state.model);

  const {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
  } = usePremChat(chatId || null);

  return (
    <section>
      <div className="flex h-screen w-full relative">
        <div>
          <Sidebar />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div className="main-content h-full z-10 relative max-h-full overflow-x-hidden scrollbar-none">
              <Header />
              <div className="z-10 relative mt-[40px] flex flex-col prem-chat-body">
                <h1 className="text-antiflashwhite text-3xl text-center">
                  Prem Chat
                </h1>
                <div className="prem-chat p-4 pb-7 md:w-[55%] w-[85%] mx-auto">
                  <p className="text-spanishgray text-base font-proximaNova-regular mb-[6px]">
                    Model
                  </p>
                  {!chatId && <ModelSelectionDropdown />}
                  {isError && <div>Something went wrong</div>}
                </div>
                <div className="md:w-[65%] w-[90%] mx-auto mt-8">
                  {chatMessages.map((message, index) => (
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
                          model
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
          <RightSidebar />
        </div>
      </div>
    </section>
  );
}

export default PremChat;
