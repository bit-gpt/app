import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import PrimaryButton from "shared/components/PrimaryButton";
import ResetIcon from "shared/components/ResetIcon";
import { BACKEND_URL_KEY, BACKEND_URL } from "shared/helpers/utils";

const AdvancedSettings = () => {
  const queryClient = useQueryClient();

  const onBackendUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    localStorage.setItem(BACKEND_URL_KEY, e.target.value);
    queryClient.invalidateQueries({ type: "all" });
    window.location.reload();
  };

  return (
    <div className="md:mb-14 mb-8">
      <h2 className="!mt-10 text-brightgray mb-[37px] text-lg">Advanced</h2>
      <div className="grid md:grid-cols-2">
        <label className="text-white mr-2 max-md:mb-4">Backend URL</label>
        <div className="flex">
          <div className="text-right w-full">
            <input
              className="form-control"
              type="text"
              defaultValue={BACKEND_URL}
              onBlur={onBackendUrlBlur}
            />
            <PrimaryButton className="!px-9 mt-[44px] opacity-70">
              Update
            </PrimaryButton>
          </div>
          <button id="reset" className="w-[50px] h-[45px]">
            <ResetIcon />
          </button>
          <Tooltip
            anchorSelect="#reset"
            place="bottom"
            className="reset-topltip"
            classNameArrow="reset-topltip__arrow"
          >
            Reset to Default
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
