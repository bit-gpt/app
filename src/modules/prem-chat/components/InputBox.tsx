import Send from "assets/images/send.svg";
import type { ForwardedRef } from "react";
import { forwardRef } from "react";

import type { InputBoxProps } from "../types";

const InputBox = forwardRef((props: InputBoxProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { question, setQuestion, disabled, placeholder } = props;
  return (
    <div className="prem-chat-input flex items-center relative">
      <input
        type="text"
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        ref={ref}
        autoFocus
      />
      <button>
        <img src={Send} alt="Send" />
      </button>
    </div>
  );
});

export default InputBox;
