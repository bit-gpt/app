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

import type { Service } from "../../modules/service/types";

import useGetService from "./useGetService";

const usePremImage = (
  serviceId: string,
  serviceType: Service["serviceType"],
  historyId: string | undefined,
): PremImageResponse => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const navigate = useNavigate();

  const { data: service } = useGetService(serviceId, serviceType);

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

  const { isPending, isError, mutate } = useMutation({
    mutationFn: () =>
      file ? generateImageViaBaseImage(service!, file, payload) : generateImage(service!, payload),
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
      navigate(`/prem-image/${serviceId}/${serviceType}/${id}`);
    },
    onError: () => {
      toast.error("Something went wrong while generating the image");
    },
  });

  const currentHistory = history.find((_history) => _history.id === historyId);

  useEffect(() => {
    setPrompt(currentHistory?.prompt || "");
  }, [currentHistory]);

  return {
    currentHistory,
    prompt: prompt,
    setPrompt,
    isPending,
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
