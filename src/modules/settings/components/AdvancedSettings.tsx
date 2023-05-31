import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BACKEND_URL_KEY, BACKEND_URL } from "shared/helpers/utils";

const AdvancedSettings = () => {
  const queryClient = useQueryClient();

  const onBackendUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    localStorage.setItem(BACKEND_URL_KEY, e.target.value);
    queryClient.invalidateQueries({ type: "all" });
    window.location.reload();
  };

  return (
    <div className=" md:mb-14 mb-8 md:-mx-10">
      <h2 className="!mt-10 text-white">Advanced</h2>
      <div>
        <label className="text-white mr-2">Backend URL</label>
        <input
          type="text"
          defaultValue={BACKEND_URL}
          onBlur={onBackendUrlBlur}
        />
      </div>
    </div>
  );
};

export default AdvancedSettings;
