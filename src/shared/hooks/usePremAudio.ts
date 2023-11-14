import { useMutation } from "@tanstack/react-query";
import generateTranscriptions from "modules/prem-audio/api/generateTranscriptions";
import type { PremAudioHook } from "modules/prem-audio/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import usePremAudioStore from "shared/store/prem-audio";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import type { Service } from "../../modules/service/types";

import useGetService from "./useGetService";

const usePremAudio = (
  serviceId: string,
  serviceType: Service["serviceType"],
  historyId: string | undefined,
): PremAudioHook => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const { data: service } = useGetService(serviceId, serviceType);

  const { addHistory, history, deleteHistory } = usePremAudioStore(
    (state) => ({
      addHistory: state.addHistory,
      history: state.history,
      deleteHistory: state.deleteHistory,
    }),
    shallow,
  );

  const { isPending, isError, mutate } = useMutation({
    mutationFn: () =>
      generateTranscriptions(service!, {
        file: file!,
        model: serviceId,
      }),
    onSuccess: (response) => {
      const id = uuid();
      addHistory({
        id,
        file: file?.name || "",
        model: serviceId,
        transcriptions: response.data.text,
        timestamp: new Date().toISOString(),
      });
      navigate(`/prem-audio/${serviceId}/${serviceType}/${id}`);
    },
    onError: () => {
      toast.error("Something went wrong while generating the transcriptions");
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

export default usePremAudio;
