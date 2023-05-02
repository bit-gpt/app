import { Link, useNavigate, useParams } from "react-router-dom";
import usePremChatStore from "../../shared/store/prem-chat";
import orderBy from "lodash/orderBy";
import { shallow } from "zustand/shallow";
import { useState } from "react";

const Sidebar = () => {
  const { history, deleteHistory, clearHistory } = usePremChatStore(
    (state) => ({
      history: state.history,
      deleteHistory: state.deleteHistory,
      clearHistory: state.clearHistory,
    }),
    shallow
  );

  const [search, setSearch] = useState("");

  const { chatId } = useParams();
  const navigate = useNavigate();

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (chatId === id) {
      navigate("/prem-chat");
    }
  };

  const onClearClick = () => {
    clearHistory();
    navigate("/prem-chat");
  };

  const filteredHistory = history.filter((item) => {
    return item.title.toLowerCase().includes(search.toLowerCase());
  });


  return (
    <div>
      <p>
        <Link to={`/prem-chat`}>New Conversation</Link>
      </p>
      <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
      {orderBy(filteredHistory, "timestamp", "desc").map((item) => {
        return (
          <p key={item.id}>
            <Link to={`/prem-chat/${item.id}`}>{item.title}</Link>
            <button onClick={() => onDeleteClick(item.id)}>Delete</button>
          </p>
        );
      })}
      {filteredHistory.length > 0 && (
        <p>
          <button onClick={onClearClick}>Clear Chat</button>
        </p>
      )}
    </div>
  );
};

export default Sidebar;
