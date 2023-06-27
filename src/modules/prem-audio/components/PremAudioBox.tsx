import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import usePremAudio from "shared/hooks/usePremAudio";
import PrimaryButton from "shared/components/PrimaryButton";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import uploadIcon from "assets/images/upload.svg";
import clsx from "clsx";
import { PremAudioContainerProps } from "../types";
import { useNavigate } from "react-router-dom";

const PremAudioBox = ({ serviceId, historyId }: Partial<PremAudioContainerProps>) => {
  const navigate = useNavigate();
  const { isLoading, onSubmit, file, setFile, currentHistory } = usePremAudio(
    serviceId!,
    historyId
  );

  const generateTranscriptions = () => {
    if (!file) return;
    onSubmit();
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/*": [".mp3", ".wav"],
    },
  });

  const onClear = () => {
    setFile(null);
    navigate(`/prem-audio/${serviceId}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <span className="bg-darkcharcoal inline-block py-2 px-[14px] min-w-[90px] w-fit rounded-tl rounded-tr">
          Audio
        </span>
        <div className="prem-audio-box bg-darkcharcoal">
          <p className="mb-[18px] text-spanishgray">Pick an audio file to convert in text</p>
          <div
            className="border-2 border-lavendergray rounded-lg h-[162px] flex justify-center items-center flex-col"
            {...getRootProps()}
          >
            <input type="file" {...getInputProps()} />
            <PrimaryButton className="px-4 flex items-center !py-2 !h-[38px] !text-sm">
              <p className="pr-4 font-proximaNova-regular">Upload wav or mp3</p>
              <div className="pl-4 btn-primary--addon">
                <img src={uploadIcon} alt="msg" width={14} height={14} />
              </div>
            </PrimaryButton>
            <span className="text-spanishgray mt-[14px]">or drag a file here</span>
          </div>
          {file && (
            <div key={file.name} className="mt-4">
              <p className="text-white text-sm">{file.name}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <OutlineCircleButton
            className="!rounded-md !h-[40px] text-white items-center flex border border-[#EC898A] !px-12 !text-sm"
            onClick={onClear}
          >
            Clear
          </OutlineCircleButton>
          <PrimaryButton
            className={clsx("!px-12 flex items-center !py-2 !h-[38px] !text-sm", {
              "opacity-50": !file,
              "animate-fill-effect": isLoading,
            })}
            onClick={generateTranscriptions}
            disabled={isLoading || !file}
          >
            Submit
          </PrimaryButton>
        </div>
      </div>
      <div className="max-w-[650px] mx-auto mt-20">
        <span className="bg-darkcharcoal inline-block py-2 px-[14px] min-w-[90px] w-fit rounded-tl rounded-tr">
          Text
        </span>
        <div className="prem-audio-box bg-darkcharcoal">
          <p className="mb-[18px] text-spanishgray">Output</p>
          <div className="border-2 border-lavendergray rounded-lg min-h-[262px] flex justify-center items-center flex-col">
            <div className="m-4 text-white text-sm">{currentHistory?.transcriptions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremAudioBox;
