import { Link, useNavigate, useParams } from "react-router-dom";
import usePremChatStore from "../../shared/store/prem-chat";
import orderBy from "lodash/orderBy";

const Sidebar = () => {
  const history = usePremChatStore((state) => state.history) || [];
  const deleteHistory = usePremChatStore((state) => state.deleteHistory);
  const { chatId } = useParams();
  const navigate = useNavigate();

  const onDeleteClick = (id: string) => {
    deleteHistory(id);
    if (chatId === id) {
      navigate("/prem-chat");
    }
  };

  return (
    <div>
      <p>
        <Link to={`/prem-chat`}>New Conversation</Link>
      </p>
      {orderBy(history, "timestamp", "desc").map((item) => {
        return (
          <p key={item.id}>
            <Link to={`/prem-chat/${item.id}`}>{item.title}</Link>
            <button onClick={() => onDeleteClick(item.id)}>Delete</button>
          </p>
        );
      })}
    </div>
  );
};

export default Sidebar;
