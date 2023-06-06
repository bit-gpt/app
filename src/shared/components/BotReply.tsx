import CopyToClipboard from "react-copy-to-clipboard";
import { BotReplyProps } from "shared/types";
import chatReplay from "assets/images/chat-replay.svg";
import copy from "assets/images/copy.svg";

const BotReply = ({ reply }: BotReplyProps) => {
  return (
    <div className="bot-reply">
      <span>
        <img className="mx-[22px]" src={chatReplay} alt="chatReplay" width={18} height={18} />
      </span>
      <p>{reply}</p>
      <CopyToClipboard text={reply}>
        <button className="ml-3 bg-white mt-auto rounded-[12px] h-[38px] min-w-[35px]">
          <img className="mx-auto" src={copy} alt="copy" width={16} height={16} />
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default BotReply;
