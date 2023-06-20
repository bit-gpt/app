import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import usePremImageStore from "shared/store/prem-image";
import generateImage from "modules/prem-image/api/generateImage";
import { PremImageResponse, UrlResponse } from "modules/prem-image/types";
import { v4 as uuid } from "uuid";

const usePremImage = (): PremImageResponse => {
  const [prompt, setPrompt] = useState("");

  const { n, size, response_format, addHistory } = usePremImageStore(
    (state) => ({
      n: state.n,
      size: state.size,
      response_format: state.response_format,
      addHistory: state.addHistory,
    }),
    shallow
  );

  const {
    isLoading,
    isError,
    mutate,
    data: response,
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
        addHistory({
          id: uuid(),
          prompt,
          images: (response.data.data || []).map((image: UrlResponse) => image.url),
          timestamp: new Date().toISOString(),
        });
      },
      onError: () => {
        toast.error("Something went wrong while generating the image");
      },
    }
  );

  const images = response?.data?.data || [];

  return {
    images,
    prompt,
    setPrompt,
    isLoading,
    isError,
    onSubmit: mutate,
    n,
  };
};

export default usePremImage;
