import { useMemo, useState } from "react";
import InputBox from "../components/prem-chat/InputBox";
import ModelSelectionDropdown from "../components/prem-chat/ModelSelectionDropdown";
import UserReply from "../shared/components/UserReply";
import BotReply from "../shared/components/BotReply";
import usePremChat from "../shared/hooks/usePremChat";
import Sidebar from "../components/prem-chat/Sidebar";
import { useParams } from "react-router-dom";
import RegenerateButton from "../components/prem-chat/RegenerateButton";

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
      <div className="flex h-screen z-10 relative">
        <aside className="h-full sidebar">
          <Sidebar />
        </aside>
        <div className="main-content bg-lines relative">
          <h1>Prem Chat</h1>
          <div>
            {!chatId && <ModelSelectionDropdown />}
            {isError && <div>Something went wrong</div>}
            {chatMessages.map((message, index) => (
              <div key={index}>
                {message.role === "user" ? (
                  <UserReply reply={message.content} />
                ) : (
                  <BotReply reply={message.content} />
                )}
              </div>
            ))}
            {chatMessages.length > 0 && !isLoading && !isError && (
              <div style={{ margin: "10px" }}>
                <RegenerateButton onRgenerateClick={onRegenerate} />
              </div>
            )}
            <form onSubmit={onSubmit}>
              <InputBox
                question={question}
                setQuestion={setQuestion}
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremChat;
