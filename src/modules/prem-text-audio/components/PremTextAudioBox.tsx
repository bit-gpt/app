import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import DownloadIcon from "shared/components/DownloadIcon";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PremAudioPlayer from "shared/components/PremAudioPlayer";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremTextAudio from "shared/hooks/usePremTextAudio";

import type { PremTextAudioContainerProps } from "../types";

const PremTextAudioBox = ({
  serviceId,
  serviceType,
  historyId,
}: Partial<PremTextAudioContainerProps>) => {
  const navigate = useNavigate();
  const { isPending, onSubmit, prompt, setPrompt, currentHistory } = usePremTextAudio(
    serviceId!,
    serviceType!,
    historyId,
  );

  const generateAudio = () => {
    if (!prompt) return;
    onSubmit();
  };

  const onClear = () => {
    setPrompt("");
    navigate(`/prem-text-audio/${serviceId}/${serviceType}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <div className="max-w-[650px] mx-auto mt-20">
          <div className="prem-audio-box bg-grey-700 rounded-tl">
            <p className="mb-[18px] text-grey-400">Input your text</p>
            <div className="border-2 border-grey-400 rounded-lg flex justify-center items-center flex-col">
              <textarea
                className="w-full rounded-lg"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={10}
              ></textarea>
            </div>
            {currentHistory && (
              <div className="gradient-border mt-5 relative prem-audio-recording">
                <p className="text-grey-200 text-sm whitespace-nowrap  overflow-hidden text-ellipsis lg:max-w-[160px] max-sm:mt-[10px] max-lg:mx-1">
                  {currentHistory.file}
                </p>
                <PremAudioPlayer url={currentHistory.fileUrl} />
                <Link to={currentHistory.fileUrl} target="_blank" className="prem-audio__download">
                  <DownloadIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <OutlineCircleButton
            className={clsx(
              "!rounded-md !h-[40px] text-white items-center flex border border-[#EC898A] !px-12 !text-sm max-sm:w-1/2 max-sm:justify-center",
              {
                "opacity-50": isPending,
              },
            )}
            onClick={onClear}
            disabled={isPending}
          >
            Clear
          </OutlineCircleButton>
          <PrimaryButton
            className={clsx(
              "!px-12 flex items-center !py-2 !h-[38px] !text-sm max-sm:w-1/2 max-sm:justify-center",
              {
                "opacity-50": !prompt,
                "animate-fill-effect": isPending,
              },
            )}
            onClick={generateAudio}
            disabled={isPending || !prompt}
          >
            Create
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default PremTextAudioBox;
