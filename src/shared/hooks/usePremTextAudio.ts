import { useMutation } from "@tanstack/react-query";
import generateAudio from "modules/prem-text-audio/api/generateAudio";
import type { PremTextAudioHook } from "modules/prem-text-audio/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePremTextAudioStore from "shared/store/prem-text-audio";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import { getServiceUrl } from "../helpers/utils";

import useService from "./useService";

const usePremTextAudio = (serviceId: string, historyId: string | undefined): PremTextAudioHook => {
  const [prompt, setPrompt] = useState<string>("");
  const navigate = useNavigate();

  const { data: response } = useService(serviceId, false);
  const service = response?.data;

  const { addHistory, history, deleteHistory } = usePremTextAudioStore(
    (state) => ({
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const { isLoading, isError, mutate } = useMutation(
    () =>
      generateAudio(service!, {
        prompt,
      }),
    {
      onSuccess: (response) => {
        const id = uuid();
        const file = response.data.url || "";
        addHistory({
          id,
          file,
          prompt,
          timestamp: new Date().toISOString(),
          fileUrl: getServiceUrl(serviceId, service!.runningPort, `files/${file}`),
        });
        navigate(`/prem-text-audio/${serviceId}/${id}`);
      },
      onError: () => {
        toast.error("Something went wrong while generating the transcriptions");
      },
    },
  );

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
    isLoading,
    isError,
    onSubmit: mutate,
    deleteHistory,
  };
};

export default usePremTextAudio;
