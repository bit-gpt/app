import { useMutation } from "@tanstack/react-query";
import generateImage from "modules/prem-image/api/generateImage";
import generateImageViaBaseImage from "modules/prem-image/api/generateImageViaBaseImage";
import type { B64JsonResponse, PremImageResponse } from "modules/prem-image/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePremImageStore from "shared/store/prem-image";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import useService from "./useService";

const usePremImage = (serviceId: string, historyId: string | undefined): PremImageResponse => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
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
    shallow,
  );

  const payload = {
    prompt,
    n,
    response_format,
    size,
    negative_prompt: negativePrompt,
    seed,
  };

  const { isLoading, isError, mutate } = useMutation(
    () =>
      file
        ? generateImageViaBaseImage(service?.runningPort ?? 0, file, payload)
        : generateImage(service?.runningPort ?? 0, payload),
    {
      onSuccess: (response) => {
        setFile(undefined);
        const id = uuid();
        addHistory({
          id,
          prompt,
          images: (response.data.data || []).map(
            (image: B64JsonResponse) => `data:image/png;base64, ${image.b64_json}`,
          ),
          timestamp: new Date().toISOString(),
        });
        navigate(`/prem-image/${serviceId}/${id}`);
      },
      onError: () => {
        toast.error("Something went wrong while generating the image");
      },
    },
  );

  const currentHistory = history.find((_history) => _history.id === historyId);

  useEffect(() => {
    setPrompt(currentHistory?.prompt || "");
  }, [currentHistory]);

  return {
    currentHistory,
    prompt: prompt,
    setPrompt,
    isLoading,
    isError,
    onSubmit: mutate,
    n,
    deleteHistory,
    negativePrompt,
    setNegativePrompt,
    file,
    setFile,
  };
};

export default usePremImage;
