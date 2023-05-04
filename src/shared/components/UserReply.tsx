import chatReplay from "../../assets/images/chat-replay.svg";
import copy from "../../assets/images/copy.svg";

type UserReply = {
  reply: string;
};

const UserReply = ({ reply }: UserReply) => {
  return (
    <div className="user-reply">
      <span>
        <img
          className="mx-[22px]"
          src={chatReplay}
          alt="chatReplay"
          width={18}
          height={18}
        />
      </span>
      <p>{reply}</p>
      <button className="ml-3 bg-white rounded-[12px] h-[38px] w-[50px]">
        <img
          className="mx-3"
          src={copy}
          alt="copy"
          width={16}
          height={16}
        />
      </button>
    </div>
  );
};

export default UserReply;
