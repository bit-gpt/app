import { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import PremAudioPlayer from "shared/components/PremAudioPlayer";
import { v4 as uuid } from "uuid";

import type { PremAudioRecordTabsProps } from "../types";

import MicError from "./MicError";
import RecordControls from "./RecordControls";

const PremRecordTab = ({ file, setFile }: PremAudioRecordTabsProps) => {
  const [url, setUrl] = useState("");

  const { status, startRecording, stopRecording, error, clearBlobUrl } = useReactMediaRecorder({
    video: false,
    audio: true,
    askPermissionOnMount: true,
    onStop(blobUrl, blob) {
      setUrl(blobUrl);
      setFile(new File([blob], `${uuid()}.wav`));
      clearBlobUrl();
    },
  });

  useEffect(() => {
    if (!file) {
      setUrl("");
    }
  }, [file]);

  return (
    <div className="prem-audio-box bg-grey-700">
      <p className="mb-[18px] text-grey-400">Record an audio from your microphone</p>
      <div className="border-2 border-grey-400 rounded-lg h-[162px] flex justify-center items-center flex-col">
        {error && <MicError error={error} />}
        {!error && (
          <RecordControls
            status={status}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        )}
      </div>
      {!!url && (
        <div className="gradient-border relative mt-5 prem-audio-recording">
          <p className="text-grey-200 text-sm whitespace-nowrap ">Prem.AI Speech File</p>
          <PremAudioPlayer url={url} />
        </div>
      )}
    </div>
  );
};

export default PremRecordTab;
