import user from "assets/images/user.svg";
import type { UserReplyProps } from "shared/types";

const UserReply = ({ reply }: UserReplyProps) => {
  return (
    <div className="user-reply">
      <p>{reply}</p>
      <button className="bg-isabelline ml-3 rounded-full min-w-[35px] h-[35px]">
        <img className="mx-auto" src={user} alt="chatReplay" width={16} height={16} />
      </button>
    </div>
  );
};

export default UserReply;
