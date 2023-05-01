type UserReply = {
  reply: string;
};

const UserReply = ({ reply }: UserReply) => {
  return (
    <div style={{marginTop: "5px"}}>
      <label
        style={{ background: "#707c97", padding: "2px", borderRadius: "4px" }}
      >
        {reply}
      </label>
    </div>
  );
};

export default UserReply;
