import NoPromptsIcon from "./NoPromptsIcon";

type textProps = {
  text: string;
};

const NoPrompts = ({ text }: textProps) => {
  return (
    <p className="text-spanishgray text-sm mt-8 font-proximaNova-regular text-center">
      <NoPromptsIcon />
      {text}
    </p>
  );
};

export default NoPrompts;
