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
      <h2 className="md:!mt-10 mt-[60px] text-brightgray md:mb-[37px] mb-4 md:text-lg text-sm">
        Advanced
      </h2>
      <form onSubmit={onUpdate}>
        <div className="flex">
          <label className="text-white mr-2 max-md:mb-4 backend-url md:text-lg text-[10px]">
            Backend URL
          </label>
          <div className="flex w-full">
            <div className="text-right w-full">
              <input
                className="form-control max-md:!py-2 max-md:text-[10px]"
                type="url"
                value={backendUrl}
                onChange={onChange}
              />
              <PrimaryButton
                className="!px-9 mt-[44px] max-md:text-sm max-md:absolute left-0 right-0 bottom-0"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </PrimaryButton>
            </div>
            <button
              id="reset"
              className="w-[50px] h-[45px] max-md:hidden"
              type="button"
              onClick={onReset}
            >
              <ResetIcon />
            </button>
            <Tooltip
              anchorSelect="#reset"
              place="bottom"
              className="reset-topltip !text-[10px]"
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
