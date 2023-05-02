import { Link } from "react-router-dom";
import usePremChatStore from "../../shared/store/prem-chat";
import orderBy from "lodash/orderBy"

const Sidebar = () => {
  const history = usePremChatStore((state) => state.history) || [];
  return (
    <div>
      <p>
        <Link to={`/prem-chat`}>New Conversation</Link>
      </p>
      {orderBy(history, 'timestamp', 'desc').map((item) => {
        return (
          <p key={item.id}>
            <Link to={`/prem-chat/${item.id}`}>{item.title}</Link>
          </p>
        );
      })}
    </div>
  );
};

export default Sidebar;
