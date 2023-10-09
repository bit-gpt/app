import { useMutation } from "@tanstack/react-query";
import generateTranscriptions from "modules/prem-audio/api/generateTranscriptions";
import type { PremAudioHook } from "modules/prem-audio/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePremAudioStore from "shared/store/prem-audio";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import useService from "./useService";

const usePremAudio = (serviceId: string, historyId: string | undefined): PremAudioHook => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { data: response } = useService(serviceId, false);
  const service = response?.data;

  const { addHistory, history, deleteHistory, model } = usePremAudioStore(
    (state) => ({
      model: state.model,
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const { isLoading, isError, mutate } = useMutation(
    () =>
      generateTranscriptions(service!, {
        file: file!,
        model,
      }),
    {
      onSuccess: (response) => {
        const id = uuid();
        addHistory({
          id,
          file: file?.name || "",
          transcriptions: response.data.text,
          timestamp: new Date().toISOString(),
        });
        navigate(`/prem-audio/${serviceId}/${id}`);
      },
      onError: () => {
        toast.error("Something went wrong while generating the transcriptions");
      },
    },
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

export default usePremAudio;
