import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import useService from "./useService";
import generateUpscalerImage from "modules/prem-upscaler/api/generateUpscalerImage";
import usePremUpscalerStore from "shared/store/prem-upscaler";
import { PremUpscalerHook } from "modules/prem-upscaler/types";

const usePremUpscaler = (serviceId: string, historyId: string | undefined): PremUpscalerHook => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { data: response } = useService(serviceId, false);
  const service = response?.data;

  const { addHistory, history, deleteHistory } = usePremUpscalerStore(
    (state) => ({
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow
  );

  const { isLoading, isError, mutate } = useMutation(
    () =>
      generateUpscalerImage(service?.runningPort!, {
        file: file!,
      }),
    {
      onSuccess: (response) => {
        const id = uuid();
        addHistory({
          id,
          file: response.data.file || "",
          name: file?.name || "File.jpg",
          timestamp: new Date().toISOString(),
        });
        navigate(`/prem-upscaler/${serviceId}/${id}`);
      },
      onError: () => {
        toast.error("Something went wrong while generating the upscaler image");
      },
    }
  );

  const currentHistory = history.find((_history) => _history.id === historyId);

  return {
    currentHistory,
    file,
    setFile,
    isLoading,
    isError,
    onSubmit: mutate,
    deleteHistory,
  };
};

export default usePremUpscaler;
