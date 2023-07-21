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

  const {
    addHistory,
    history,
    deleteHistory,
    n,
    prompt,
    response_format,
    guidance_scale,
    num_inference_steps,
  } = usePremUpscalerStore(
    (state) => ({
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
      n: state.n,
      prompt: state.prompt,
      response_format: state.response_format,
      guidance_scale: state.guidance_scale,
      num_inference_steps: state.num_inference_steps,
    }),
    shallow
  );

  const { isLoading, isError, mutate } = useMutation(
    () =>
      generateUpscalerImage(service?.runningPort!, {
        image: file!,
        prompt,
        n,
        response_format,
        guidance_scale,
        num_inference_steps,
      }),
    {
      onSuccess: (response) => {
        const id = uuid();
        addHistory({
          id,
          file: `data:image/png;base64, ${response.data?.data[0]?.b64_json || ""}`,
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
