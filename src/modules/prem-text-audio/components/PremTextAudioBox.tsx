import PrimaryButton from "shared/components/PrimaryButton";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import clsx from "clsx";
import { PremTextAudioContainerProps } from "../types";
import { useNavigate } from "react-router-dom";
import usePremTextAudio from "shared/hooks/usePremTextAudio";

const PremTextAudioBox = ({ serviceId, historyId }: Partial<PremTextAudioContainerProps>) => {
  const navigate = useNavigate();
  const { isLoading, onSubmit, prompt, setPrompt, currentHistory } = usePremTextAudio(
    serviceId!,
    historyId
  );

  const generateAudio = () => {
    if (!prompt) return;
    onSubmit();
  };

  const onClear = () => {
    setPrompt("");
    navigate(`/prem-text-audio/${serviceId}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <div className="max-w-[650px] mx-auto mt-20">
          <div className="prem-audio-box bg-darkcharcoal">
            <p className="mb-[18px] text-spanishgray">Input your text</p>
            <div className="border-2 border-lavendergray rounded-lg flex justify-center items-center flex-col">
              <textarea
                className="w-full"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <OutlineCircleButton
            className={clsx(
              "!rounded-md !h-[40px] text-white items-center flex border border-[#EC898A] !px-12 !text-sm",
              {
                "opacity-50": isLoading,
              }
            )}
            onClick={onClear}
            disabled={isLoading}
          >
            Clear
          </OutlineCircleButton>
          <PrimaryButton
            className={clsx("!px-12 flex items-center !py-2 !h-[38px] !text-sm", {
              "opacity-50": !prompt,
              "animate-fill-effect": isLoading,
            })}
            onClick={generateAudio}
            disabled={isLoading || !prompt}
          >
            Create
          </PrimaryButton>
        </div>
      </div>

      {currentHistory && (
        <div className="max-w-[650px] mx-auto mt-20">
          <div className="prem-audio-box bg-darkcharcoal">
            <div>
              <p className="mb-[18px] text-spanishgray">{currentHistory.file}</p>
              <audio controls key={currentHistory.id}>
                <source src={currentHistory.fileUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremTextAudioBox;
