import Send from "assets/images/send.svg";
import type { ForwardedRef } from "react";
import { useRef, useState, forwardRef } from "react";

import type { InputBoxProps } from "../types";

const InputBox = forwardRef((props: InputBoxProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const { question, setQuestion, disabled, placeholder } = props;
  const textareaRef = useRef(null);

  const handleInputChange = (event: any) => {
    const { value } = event.target;
    setQuestion(value);

    // Automatically adjust the textarea's height as the user types
    if (textareaRef.current) {
      (textareaRef.current as any).style.height = "auto";
      (textareaRef.current as any).style.height = (textareaRef.current as any).scrollHeight + "px";
    }
  };

  const handleSendClick = () => {
    if (question.trim() !== "") {
      // Send the message (you can add the logic here)
      console.log("Message sent:", question);

      // Clear the textarea and reset its height
      setQuestion("");
      if (textareaRef.current) {
        (textareaRef.current as any).style.height = "auto";
      }
    }
  };

  return (
    <div className="prem-chat-textarea">
      <div className="textarea-container">
        <div
          ref={textareaRef}
          className="expandable-textarea"
          contentEditable={true}
          placeholder={placeholder}
          onChange={handleInputChange}
        >
          {question}
        </div>
      </div>
      <button onClick={handleSendClick}>
        <img src={Send} alt="Send" />
      </button>
    </div>
  );
});

export default InputBox;
