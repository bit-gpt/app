import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { Tooltip } from "react-tooltip";
import PrimaryButton from "shared/components/PrimaryButton";
import ResetIcon from "shared/components/ResetIcon";
import { toast } from "react-toastify";
import useSettingStore from "shared/store/setting";
import { getBackendUrl } from "shared/helpers/utils";
import checkHealth from "../api/checkHealth";
const AdvancedSettings = () => {
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
    <div className="md:mb-14 mb-8">
      <h2 className="!mt-10 text-brightgray mb-[37px] text-lg">Advanced</h2>
      <form onSubmit={onUpdate}>
        <div className="grid md:grid-cols-2">
          <label className="text-white mr-2 max-md:mb-4">Backend URL</label>
          <div className="flex">
            <div className="text-right w-full">
              <input className="form-control" type="url" value={backendUrl} onChange={onChange} />
              <PrimaryButton
                className="!px-9 mt-[44px] opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </PrimaryButton>
            </div>
            <button id="reset" className="w-[50px] h-[45px]" type="button" onClick={onReset}>
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
      </form>
    </div>
  );
};

export default AdvancedSettings;
