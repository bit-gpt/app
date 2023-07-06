import { AudioRecorderProps } from "../types";

const AudioRecorder = ({
  error,
  pauseRecording,
  resumeRecording,
  startRecording,
  stopRecording,
  status,
}: AudioRecorderProps) => {
  if (error === "permission_denied") {
    return <p>Mic Permisison denied</p>;
  }
  if (error) {
    return <p>Can not record audio</p>;
  }

  return (
    <div className="mb-[18px] text-white">
      {status === "idle" && <button onClick={startRecording}>Record</button>}

      {status === "recording" && (
        <div>
          <button onClick={pauseRecording}>Pause</button>
          <button onClick={stopRecording} className="m-1">
            Stop
          </button>
        </div>
      )}
      {status === "paused" && (
        <div>
          <button className="m-1" onClick={resumeRecording}>
            Resume
          </button>
          <button onClick={stopRecording}>Stop</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
