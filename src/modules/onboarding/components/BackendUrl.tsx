import clsx from "clsx";
import { useState } from "react";

import info from "../../../assets/images/comment-info.svg";
import useSettingStore from "../../../shared/store/setting";

interface BackendUrlProps {
  isRunning: boolean;
  name: string;
}

const BackendUrl = ({ isRunning, name }: BackendUrlProps) => {
  const backendUrl = useSettingStore((state) => state.backendUrl);
  const setBackendUrl = useSettingStore((state) => state.setBackendUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [backendUrlState, setBackendUrlState] = useState(backendUrl);

  const handleApply = () => {
    setBackendUrl(backendUrlState);
    setIsEditing(false);
  };

  const handleChange = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex justify-between items-baseline mt-3">
      <p className="text-[#CFCFCF] text-base flex w-2/3">{name}</p>
      <div className="flex max-sm:flex-wrap flex-1 items-center w-1/3">
        {isRunning ? (
          <span className="text-ok text-sm">&#10003;</span>
        ) : (
          <img src={info} alt="info" />
        )}
        <input
          autoComplete="off"
          type="text"
          style={{ width: `${backendUrlState.length}ch` }}
          className={clsx("text-sm py-1 px-2 outline-none", {
            "text-warning": !isRunning,
            "text-ok": isRunning,
            "bg-[#4D4D4F58] rounded-lg": isEditing,
            "bg-transparent": !isEditing,
          })}
          value={backendUrlState}
          disabled={!isEditing}
          onChange={(e) => setBackendUrlState(e.target.value)}
        />
        {!isEditing ? (
          <button type="button" onClick={handleChange} className="text-white opacity-70">
            Change
          </button>
        ) : (
          <button type="button" onClick={handleApply} className="text-white opacity-70">
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default BackendUrl;
