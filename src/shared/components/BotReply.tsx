type BotReply = {
  reply: string;
};

const BotReply = ({ reply }: BotReply) => {
  return (
    <div style={{ marginTop: "5px" }}>
      <label
        style={{ background: "#EA938E", padding: "2px", borderRadius: "4px" }}
      >
        {reply}
      </label>
    </div>
  );
};

export default BotReply;
