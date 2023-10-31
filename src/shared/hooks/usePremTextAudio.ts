import { useMutation } from "@tanstack/react-query";
import generateAudio from "modules/prem-text-audio/api/generateAudio";
import type { PremTextAudioHook } from "modules/prem-text-audio/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePremTextAudioStore from "shared/store/prem-text-audio";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import type { Service } from "../../modules/service/types";

import useGetService from "./useGetService";

const usePremTextAudio = (
  serviceId: string,
  serviceType: Service["serviceType"],
  historyId: string | undefined,
): PremTextAudioHook => {
  const [prompt, setPrompt] = useState<string>("");
  const navigate = useNavigate();

  const { data: service } = useGetService(serviceId, serviceType);

  const { addHistory, history, deleteHistory } = usePremTextAudioStore(
    (state) => ({
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const { isPending, isError, mutate } = useMutation({
    mutationFn: () =>
      generateAudio(service!, {
        prompt,
      }),
    onSuccess: (response) => {
      const id = uuid();
      const file = response.data.url || "";
      addHistory({
        id,
        file,
        prompt,
        timestamp: new Date().toISOString(),
        fileUrl: `${service!.baseUrl}/files/${file}`,
      });
      navigate(`/prem-text-audio/${serviceId}/${serviceType}/${id}`);
    },
    onError: () => {
      toast.error("Something went wrong while generating the transcriptions");
    },
  });

  const currentHistory = history.find((_history) => _history.id === historyId);

  useEffect(() => {
    if (currentHistory) {
      setPrompt(currentHistory.prompt);
    } else {
      setPrompt("");
    }
  }, [currentHistory]);

  return {
    currentHistory,
    prompt,
    setPrompt,
    isPending,
    isError,
    onSubmit: mutate,
    deleteHistory,
  };
};

export default usePremTextAudio;
