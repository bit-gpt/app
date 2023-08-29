import { useState } from "react";
import { runSwarmMode } from "shared/helpers/utils";

const SwarmMode = () => {
  const [swarmMode, setSwarmMode] = useState(false);

  const onSubmit = () => {
    runSwarmMode();
    setSwarmMode(true);
  };

  return (
    <div className="flex items-center">
      {swarmMode ? (
        <label className="text-white mr-2 backend-url md:text-lg text-[11px]">
          Swarm Mode Enabled
        </label>
      ) : (
        <>
          <label className="text-white mr-2 backend-url md:text-lg text-[11px]">
            Swarm Mode Not Enabled
          </label>
          <button type="button" onClick={onSubmit}>
            Enable
          </button>
        </>
      )}
    </div>
  );
};

export default SwarmMode;
