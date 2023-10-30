import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import PrimaryButton from "shared/components/PrimaryButton";
import ResetIcon from "shared/components/ResetIcon";
import useSettingStore, { getBackendUrl } from "shared/store/setting";

import checkHealth from "../api/checkHealth";

const BackendUrl = () => {
  const queryClient = useQueryClient();

  const { mutate: checkHealthRequest, isPending } = useMutation({ mutationFn: checkHealth });

  const backendUrlFromStore = useSettingStore((state) => state.backendUrl);
  const setBackendUrlToStore = useSettingStore((state) => state.setBackendUrl);

  const [backendUrl, setBackendUrl] = useState(backendUrlFromStore);

  const onChange = (e: React.FocusEvent<HTMLInputElement>) => {
    setBackendUrl(e.target.value);
  };

  const onUpdate = (e: FormEvent) => {
    e.preventDefault();
    checkHealthRequest(undefined, {
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
        <label className="text-grey-300 mr-2 backend-url md:text-lg">Backend URL</label>
        <div className="flex w-full">
          <div className="text-right w-full">
            <input className="form-control" type="url" value={backendUrl} onChange={onChange} />
          </div>
          <button id="reset" className="w-8 ml-4" type="button" onClick={onReset}>
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
        <PrimaryButton type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default BackendUrl;
