import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";
import { AUDIO_TAB, RECORD_TAB } from "shared/helpers/utils";
import usePremAudio from "shared/hooks/usePremAudio";

import type { PremAudioContainerProps } from "../types";

import PremAudioTab from "./PremAudioTab";
import PremRecordTab from "./PremRecordTab";

const PremAudioBox = ({ serviceId, serviceType, historyId }: Partial<PremAudioContainerProps>) => {
  const navigate = useNavigate();
  const { isPending, onSubmit, file, setFile, currentHistory } = usePremAudio(
    serviceId!,
    serviceType!,
    historyId,
  );
  const [activeTab, setActiveTab] = useState(AUDIO_TAB);

  const generateTranscriptions = () => {
    if (!file) return;
    onSubmit();
  };

  const onClear = () => {
    setFile(null);
    navigate(`/prem-audio/${serviceId}/${serviceType}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFile(null);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <div className="tabs-header">
          <button
            onClick={() => handleTabChange(AUDIO_TAB)}
            className={clsx(activeTab === AUDIO_TAB && "bg-grey-700", "rounded-tl rounded-tr")}
          >
            Audio
          </button>
          <button
            onClick={() => handleTabChange(RECORD_TAB)}
            className={clsx(activeTab === RECORD_TAB && "bg-grey-700", "rounded-tl rounded-tr")}
          >
            Record
          </button>
        </div>
        {activeTab === AUDIO_TAB && <PremAudioTab file={file} setFile={setFile} />}
        {activeTab === RECORD_TAB && <PremRecordTab file={file} setFile={setFile} />}
        <div className="mt-4 flex justify-end gap-3">
          <OutlineCircleButton
            className={clsx(
              "!rounded-md !h-[40px] text-white items-center flex border border-[#EC898A] !px-12 !text-sm max-sm:w-1/2 max-sm:justify-center",
              {
                "opacity-50 pointer-events-none": isPending,
              },
            )}
            onClick={onClear}
            disabled={isPending}
          >
            Clear
          </OutlineCircleButton>
          <PrimaryButton
            className={clsx(
              "!px-12 flex items-center !py-2 !h-[38px] !text-sm max-sm:w-1/2 max-sm:justify-center max-sm:!h-10",
              {
                "opacity-50": !file,
                "animate-fill-effect": isPending,
              },
            )}
            onClick={generateTranscriptions}
            disabled={isPending || !file}
          >
            Submit
          </PrimaryButton>
        </div>
      </div>
      {currentHistory?.transcriptions && (
        <div className="max-w-[650px] mx-auto mt-20">
          <span className="bg-grey-700 inline-block py-2 px-[14px] min-w-[90px] w-fit rounded-tl rounded-tr">
            Text
          </span>
          <div className="prem-audio-box bg-grey-700">
            <p className="mb-[18px] text-grey-400">Output</p>
            <div className="border-2 border-grey-400 rounded-lg min-h-[262px] flex justify-center items-center flex-col">
              <div className="m-4 text-white text-sm">{currentHistory?.transcriptions}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremAudioBox;
