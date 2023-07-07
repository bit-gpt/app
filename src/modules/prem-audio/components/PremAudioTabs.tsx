import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import PrimaryButton from "shared/components/PrimaryButton";
import { PremAudioRecordTabsProps } from "../types";
import uploadIcon from "assets/images/upload.svg";

const PremAudioTabs = ({ file, setFile, activeTab }: PremAudioRecordTabsProps) => {
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
  return (
    <>
      {activeTab === 0 && (
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
          {file && (
            <div key={file.name} className="mt-4">
              <p className="text-white text-sm">{file.name}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PremAudioTabs;
