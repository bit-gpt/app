import user from "../../assets/images/user.svg";

type UserReply = {
  reply: string;
};

const UserReply = ({ reply }: UserReply) => {
  return (
    <div className="user-reply">
      <p>{reply}</p>
      <button className="bg-isabelline ml-3 rounded-full min-w-[35px] h-[35px]">
        <img
          className="mx-auto"
          src={user}
          alt="chatReplay"
          width={16}
          height={16}
        />
      </button>
    </div>
  );
};

export default UserReply;
