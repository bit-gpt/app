import NoPromptsIcon from "../../assets/images/no-prompts.svg";

type textProps = {
  text: string;
};

const NoPrompts = ({ text }: textProps) => {
  return (
    <p className="text-grey-400 text-sm mt-8  text-center">
      <img src={NoPromptsIcon} alt="no prompts" className="mx-auto mb-3" />
      {text}
    </p>
  );
};

export default NoPrompts;
