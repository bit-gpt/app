import NoPromptsIcon from "./NoPromptsIcon";

type historyProps = {
  history: "object";
};
const NoPrompts = ({ history }: historyProps) => {
  return (
    <>
      {history.length == 0 && (
        <p className="text-spanishgray text-sm mt-6 font-proximaNova-regular text-center">
          <NoPromptsIcon />
          No prompts.
        </p>
      )}
    </>
  );
};

export default NoPrompts;
