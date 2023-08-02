import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import PrimaryButton from "shared/components/PrimaryButton";
import ResetIcon from "shared/components/ResetIcon";
import { getBackendUrl } from "shared/helpers/utils";
import useSettingStore from "shared/store/setting";

import checkHealth from "../api/checkHealth";

const BackendUrl = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(checkHealth);

  const backendUrlFromStore = useSettingStore((state) => state.backendUrl);
  const setBackendUrlToStore = useSettingStore((state) => state.setBackendUrl);

  const [backendUrl, setBackendUrl] = useState(backendUrlFromStore);

  const onChange = (e: React.FocusEvent<HTMLInputElement>) => {
    setBackendUrl(e.target.value);
  };

  const onUpdate = (e: FormEvent) => {
    e.preventDefault();
    mutate(backendUrl, {
      onSuccess: (response) => {
        if (response.data.status) {
          setBackendUrlToStore(backendUrl);
          queryClient.invalidateQueries({ type: "all" });
          queryClient.clear();
          toast.success("Setting updated successfully");
        }
      },
      onError: () => {
        toast.error("Invalid Backend URL");
      },
    });
  };

  const onReset = () => {
    setBackendUrl(getBackendUrl());
  };

  return (
    <form onSubmit={onUpdate}>
      <div className="flex items-center">
        <label className="text-white mr-2 backend-url md:text-lg text-[11px]">Backend URL</label>
        <div className="flex w-full">
          <div className="text-right w-full">
            <input
              className="form-control maxMd:!py-2 maxMd:text-[10px]"
              type="url"
              value={backendUrl}
              onChange={onChange}
            />
          </div>
          <button
            id="reset"
            className="w-[50px] h-[45px] maxMd:hidden"
            type="button"
            onClick={onReset}
          >
            <ResetIcon />
          </button>
          <Tooltip
            anchorSelect="#reset"
            place="bottom"
            className="reset-tooltip !text-[10px]"
            classNameArrow="reset-topltip__arrow"
          >
            Reset to Default
          </Tooltip>
        </div>
      </div>
      <div className="text-right mt-[29px] mr-[45px]">
        <PrimaryButton
          className="!px-9 maxMd:text-[12px] left-0 right-0 bottom-0 maxMd:max-w-[322px] maxMd:mx-auto maxMd:py-1 maxMd:h-[36px]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default BackendUrl;
