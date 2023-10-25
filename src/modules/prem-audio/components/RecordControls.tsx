import PrimaryButton from "shared/components/PrimaryButton";

const RecordControls = ({
  status,
  startRecording,
  stopRecording,
}: {
  status: string;
  stopRecording: () => void;
  startRecording: () => void;
}) => {
  return (
    <>
      {status === "idle" && (
        <PrimaryButton
          className="px-4 flex items-center !py-2 !h-[38px] !text-sm"
          onClick={startRecording}
        >
          <p className="pr-4  flex items-center gap-2">
            <span className="mt-[2px]">◉</span>
            Start Recording
          </p>
        </PrimaryButton>
      )}
      {status === "recording" && (
        <PrimaryButton
          className="px-4 flex items-center !py-2 !h-[38px] !text-sm"
          onClick={stopRecording}
        >
          <p className="pr-4 ">▣ Stop recording</p>
        </PrimaryButton>
      )}
    </>
  );
};

export default RecordControls;
