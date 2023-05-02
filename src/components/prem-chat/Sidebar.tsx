import { Link } from "react-router-dom";
import usePremChatStore from "../../shared/store/prem-chat";

const Sidebar = () => {
  const history = usePremChatStore((state) => state.history) || [];
console.log({history})
  return (
    <div>
      {history.map((item) => {
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
