import type { Event, UnlistenFn, TauriEvent } from "@tauri-apps/api/event";
import { listen } from "@tauri-apps/api/event";
import uploadIcon from "assets/images/upload.svg";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import PremAudioPlayer from "shared/components/PremAudioPlayer";
import PrimaryButton from "shared/components/PrimaryButton";

import type { PremAudioRecordTabsProps } from "../types";

const PremAudioTab = ({ file, setFile }: PremAudioRecordTabsProps) => {
  const [url, setUrl] = useState("");
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    [setFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/*": [".wav"],
    },
  });

  useEffect(() => {
    (async () => {
      let unlisten: UnlistenFn;
      try {
        unlisten = await listen("tauri://file-drop", (event: Event<TauriEvent>) => {
          onDrop(event.payload as any);
        });
      } catch (error) {
        console.error(error);
      }
      return () => unlisten();
    })();
  }, [onDrop]);

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
    <div className="prem-audio-box bg-grey-700">
      <p className="mb-[18px] text-grey-400">Pick an audio file to convert in text</p>
      <div
        className="border-2 border-grey-400 rounded-lg h-[162px] flex justify-center items-center flex-col"
        {...getRootProps()}
      >
        <input type="file" {...getInputProps()} />
        <PrimaryButton className="px-4 flex items-center !py-2 !h-[38px] !text-sm">
          <p className="pr-4 ">Upload wav</p>
          <div className="pl-4 btn-primary--addon">
            <img src={uploadIcon} alt="msg" width={14} height={14} />
          </div>
        </PrimaryButton>
        <span className="text-grey-400 mt-[14px]">
          {isDragActive ? "Drop the files here ..." : "or drag a file here"}
        </span>
      </div>

      {!!url && (
        <div className="gradient-border relative mt-5 prem-audio-recording">
          <p className="text-grey-200 text-sm whitespace-nowrap  overflow-hidden text-ellipsis lg:max-w-[160px] max-sm:mt-[10px] max-lg:mx-1">
            {file?.name}
          </p>
          <PremAudioPlayer url={url} />
        </div>
      )}
    </div>
  );
};

export default PremAudioTab;
