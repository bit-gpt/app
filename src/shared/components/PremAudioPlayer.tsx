import Plyr from "plyr-react";
import "plyr-react/plyr.css";

type PremAudioPlayerType = {
  url: string;
};

const PremAudioPlayer = ({ url }: PremAudioPlayerType) => {
  return (
    <Plyr
      source={{
        type: "audio",
        sources: [
          {
            src: url,
          },
        ],
      }}
    />
  );
};

export default PremAudioPlayer;
