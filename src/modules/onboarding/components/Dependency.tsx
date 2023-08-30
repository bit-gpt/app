import { Tooltip } from "react-tooltip";
import Spinner from "shared/components/Spinner";

import info from "../../../assets/images/comment-info.svg";
import type { DependencyProps } from "../types";

const Dependency = ({
  isRunning,
  name,
  status,
  tooltip,
  id,
  isLoading = false,
}: DependencyProps) => {
  return (
    <div className="flex justify-between mt-4">
      <p className="text-[#CFCFCF] text-base flex w-2/3">{name}</p>
      {isRunning && (
        <div className="flex w-1/3">
          <span className="text-ok text-sm mr-2">&#10003;</span>
          <p className="text-ok text-base">{status}</p>
        </div>
      )}
      {isLoading && (
        <p>
          <Spinner className="w-5 h-5" />
        </p>
      )}
      {!isRunning && !isLoading && (
        <>
          <button className="text-warning flex gap-2 flex-1 justify-start" id={`${id}`}>
            <img src={info} alt="info" />
            {status}
          </button>
          <Tooltip anchorSelect={`#${id}`} place="right" className="tooltip !left-[450px]">
            {tooltip}
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default Dependency;
