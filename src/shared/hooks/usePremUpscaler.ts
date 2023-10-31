import { useMutation } from "@tanstack/react-query";
import generateUpscalerImage from "modules/prem-upscaler/api/generateUpscalerImage";
import type { PremUpscalerHook } from "modules/prem-upscaler/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePremUpscalerStore from "shared/store/prem-upscaler";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import type { Service } from "../../modules/service/types";

import useGetService from "./useGetService";

const usePremUpscaler = (
  serviceId: string,
  serviceType: Service["serviceType"],
  historyId: string | undefined,
): PremUpscalerHook => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { data: service } = useGetService(serviceId, serviceType);

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
    shallow,
  );

  const { isPending, isError, mutate } = useMutation({
    mutationFn: () =>
      generateUpscalerImage(service!, {
        image: file!,
        prompt,
        n,
        response_format,
        guidance_scale,
        num_inference_steps,
      }),
    onSuccess: (response) => {
      const id = uuid();
      addHistory({
        id,
        file: `data:image/png;base64, ${response.data?.data[0]?.b64_json || ""}`,
        name: file?.name || "File.jpg",
        timestamp: new Date().toISOString(),
      });
      navigate(`/prem-upscaler/${serviceId}/${serviceType}/${id}`);
    },
    onError: () => {
      toast.error("Something went wrong while generating the upscaler image");
    },
  });

  const currentHistory = history.find((_history) => _history.id === historyId);

  return {
    currentHistory,
    file,
    setFile,
    isPending,
    isError,
    onSubmit: mutate,
    deleteHistory,
  };
};

export default usePremUpscaler;
