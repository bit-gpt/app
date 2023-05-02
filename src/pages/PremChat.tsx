import { useMemo, useState } from "react";
import InputBox from "../components/prem-chat/InputBox";
import ModelSelectionDropdown from "../components/prem-chat/ModelSelectionDropdown";
import UserReply from "../shared/components/UserReply";
import BotReply from "../shared/components/BotReply";
import usePremChat from "../shared/hooks/usePremChat";
import Sidebar from "../components/prem-chat/Sidebar";
import { useParams } from "react-router-dom";

function PremChat() {
  const { chatId } = useParams();

  const { chatMessages, onSubmit, question, setQuestion, isLoading, error } =
    usePremChat(chatId || null);

  return (
    <div className="container sidebar">
      <aside className="sidebar__sidebar">
        <Sidebar />
      </aside>
      <div className="sidebar__main">
        <h1>Prem Chat</h1>
        <div>
          <ModelSelectionDropdown />
          {!!error && <div>Something went wrong</div>}
          {chatMessages.map((message, index) => (
            <div key={index}>
              {message.role === "user" ? (
                <UserReply reply={message.content} />
              ) : (
                <BotReply reply={message.content} />
              )}
            </div>
          ))}
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
  );
}

export default PremChat;
