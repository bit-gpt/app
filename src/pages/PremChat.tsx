import { useMemo, useState } from "react";
import InputBox from "../components/prem-chat/InputBox";
import ModelSelectionDropdown from "../components/prem-chat/ModelSelectionDropdown";
import UserReply from "../shared/components/UserReply";
import BotReply from "../shared/components/BotReply";
import usePremChat from "../shared/hooks/usePremChat";
import Sidebar from "../components/prem-chat/Sidebar";
import { useParams } from "react-router-dom";
import RegenerateButton from "../components/prem-chat/RegenerateButton";
import setting from "../assets/images/setting.svg";

function PremChat() {
  const { chatId } = useParams();

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
        <div className="bg-lines bg-[#20232B] relative h-full w-full">
          <div className="main-content h-full z-10 relative max-h-full overflow-x-hidden scrollbar-none">
            <div className="border-b border-light w-full h-[77px] py-3 flex">
              <div className="border-l border-light pl-6 flex items-center ml-auto max-w-max">
                <button
                  type="button"
                  className="bg-sonicsilver py-3 px-4 rounded-md text-lg font-proximaNova-regular text-white"
                >
                  Share Chat
                </button>
                <img
                  className="mx-[22px]"
                  src={setting}
                  alt="msg"
                  width={22}
                  height={22}
                />
              </div>
            </div>
            <div className="z-10 relative mt-[40px] flex flex-col prem-chat-body">
              <h1 className="text-antiflashwhite text-3xl text-center">
                Prem Chat
              </h1>
              <div className="prem-chat p-4 pb-7 w-[600px] mx-auto">
                <p className="text-[#999999] text-base font-proximaNova-regular mb-[6px]">
                  Model
                </p>
                {!chatId && <ModelSelectionDropdown />}
                {isError && <div>Something went wrong</div>}
              </div>
              <div className="w-[600px] mx-auto">
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
            <div className="max-w-[55%] mx-auto">
              {chatMessages.length > 0 && !isLoading && !isError && (
                <div>
                  <RegenerateButton onRgenerateClick={onRegenerate} />
                </div>
              )}
              <form className="text-center" onSubmit={onSubmit}>
                <InputBox
                  question={question}
                  setQuestion={setQuestion}
                  disabled={isLoading}
                />
              </form>
              <p className="text-philippinegray mt-3 text-[10px] font-proximaNova-regular text-center">
                ChatBot UI. Chat bot UI is an advanced chatbot kit for OpenAI'a
                chat models aiming to mimic ChatGPT's interface and
                functionality.
              </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremChat;
