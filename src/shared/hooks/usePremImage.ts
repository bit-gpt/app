import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import usePremImageStore from "shared/store/prem-image";
import generateImage from "modules/prem-image/api/generateImage";
import { PremImageResponse, UrlResponse } from "modules/prem-image/types";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const usePremImage = (historyId: string | undefined): PremImageResponse => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const { n, size, response_format, addHistory, history } = usePremImageStore(
    (state) => ({
      n: state.n,
      size: state.size,
      response_format: state.response_format,
      addHistory: state.addHistory,
      history: state.history,
    }),
    shallow
  );

  const {
    isLoading,
    isError,
    mutate,
  } = useMutation(
    () =>
      generateImage({
        prompt,
        n,
        response_format,
        size,
      }),
    {
      onSuccess: (response) => {
        const id = uuid();
        addHistory({
          id,
          prompt,
          images: (response.data.data || []).map((image: UrlResponse) => image.url),
          timestamp: new Date().toISOString(),
        });
        navigate(`/prem-image/${id}`);
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
  };
};

export default usePremImage;
