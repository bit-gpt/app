type InputBox = {
  question: string;
  setQuestion: (question: string) => void;
  disabled?: boolean;
};
const InputBox = ({ question, setQuestion, disabled }: InputBox) => {
  return (
    <input
      type="text"
      name="question"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      disabled={disabled}
    />
  );
};

export default InputBox;
