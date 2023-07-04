import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import usePremImageStore from "shared/store/prem-image";
import generateImage from "modules/prem-image/api/generateImage";
import { B64JsonResponse, PremImageResponse, UrlResponse } from "modules/prem-image/types";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import useService from "./useService";

const usePremImage = (serviceId: string, historyId: string | undefined): PremImageResponse => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const navigate = useNavigate();

  const { data: response } = useService(serviceId, false);
  const service = response?.data;

  const { n, size, response_format, addHistory, history, deleteHistory, seed } = usePremImageStore(
    (state) => ({
      n: state.n,
      size: state.size,
      response_format: state.response_format,
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
      seed: state.seed,
    }),
    shallow
  );

  const { isLoading, isError, mutate } = useMutation(
    () =>
      generateImage(service?.runningPort!, {
        prompt,
        n,
        response_format,
        size,
        negative_prompt: negativePrompt,
        seed,
      }),
    {
      onSuccess: (response) => {
        const id = uuid();
        addHistory({
          id,
          prompt,
          images: (response.data.data || []).map(
            (image: B64JsonResponse) => `data:image/png;base64, ${image.b64_json}`
          ),
          timestamp: new Date().toISOString(),
        });
        navigate(`/prem-image/${serviceId}/${id}`);
      },
      onError: () => {
        toast.error("Something went wrong while generating the image");
      },
    }
  );

  const currentHistory = history.find((_history) => _history.id === historyId);

  return {
    currentHistory,
    prompt: prompt || currentHistory?.prompt || "",
    setPrompt,
    isLoading,
    isError,
    onSubmit: mutate,
    n,
    deleteHistory,
    negativePrompt,
    setNegativePrompt,
  };
};

export default usePremImage;
