import user from "assets/images/user.svg";
import type { UserReplyProps } from "shared/types";

const UserReply = ({ reply }: UserReplyProps) => {
  return (
    <div className="user-reply">
      <pre>{reply}</pre>
      <div className="flex justify-center align-center bg-grey-100 ml-3 rounded-full min-w-[35px] h-[35px]">
        <img src={user} alt="user" width={16} height={16} />
      </div>
    </div>
  );
};

export default UserReply;
