import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PrimaryButton from "shared/components/PrimaryButton";
import { PremAudioRecordTabsProps } from "../types";
import uploadIcon from "assets/images/upload.svg";
import PremAudioPlayer from "shared/components/PremAudioPlayer";

const PremAudioTab = ({ file, setFile }: PremAudioRecordTabsProps) => {
  const [url, setUrl] = useState("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/*": [".mp3", ".wav"],
    },
  });

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setUrl(e.target?.result as string);
      };
    } else {
      setUrl("");
    }
  }, [file]);

  return (
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
        <span className="text-spanishgray mt-[14px]">
          {isDragActive ? "Drop the files here ..." : "or drag a file here"}
        </span>
      </div>

      {!!url && (
        <div className="gradient-border relative mt-5 prem-audio-recording">
          <p className="text-cultured text-sm whitespace-nowrap font-proximaNova-regular">
            {file?.name}
          </p>
          <PremAudioPlayer url={url} />
        </div>
      )}
    </div>
  );
};

export default PremAudioTab;
