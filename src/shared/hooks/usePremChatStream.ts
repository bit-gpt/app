import { fetchEventSource } from "@microsoft/fetch-event-source";
import type { AxiosError } from "axios";
import type { PremChatResponse } from "modules/prem-chat/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isProxyEnabled } from "shared/helpers/utils";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

import usePremChatStore from "../store/prem-chat";
import useSettingStore from "../store/setting";

import useService from "./useService";

const usePremChatStream = (serviceId: string, chatId: string | null): PremChatResponse => {
  const [question, setQuestion] = useState("");
  const [tempQuestion, setTempQuestion] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [pending, setPending] = useState<string | null>();
  const { data: response } = useService(serviceId, false);
  const service = response?.data;
  const abortController = useRef<AbortController>();

  const {
    history,
    addHistory,
    updateHistoryMessages,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    n,
    presence_penalty,
    promptTemplate,
    setPromptTemplate,
    setChatServiceUrl,
    chatServiceUrl,
  } = usePremChatStore(
    (state) => ({
      history: state.history,
      addHistory: state.addHistory,
      updateHistoryMessages: state.updateHistoryMessages,
      temperature: state.temperature,
      max_tokens: state.max_tokens,
      top_p: state.top_p,
      frequency_penalty: state.frequency_penalty,
      n: state.n,
      presence_penalty: state.presence_penalty,
      promptTemplate: state.promptTemplate,
      setPromptTemplate: state.setPromptTemplate,
      setChatServiceUrl: state.setChatServiceUrl,
      chatServiceUrl: state.chatServiceUrl,
    }),
    shallow,
  );
  const [backendUrlState, setBackendUrlState] = useState("");

  useEffect(() => {
    if (service) {
      const backendUrl = service.invokeMethod.baseUrl;
      setBackendUrlState(backendUrl);
      setChatServiceUrl(backendUrl);
    }
    if (!promptTemplate) {
      setPromptTemplate(service?.promptTemplate || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const messages = history.find((_history) => _history.id === chatId)?.messages || [];

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      processQuestion(question);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question],
  );

  const processQuestion = (question: string) => {
    const query = question.trim();
    if (!query) {
      return;
    }
    setTempQuestion(query);
    setQuestion("");
    const newMessage = { role: "user", content: `${promptTemplate}${query}` };
    setPending(undefined);
    setLoading(true);
    abortController.current = new AbortController();

    const isIP = useSettingStore.getState().isIP;
    const headers = { "Content-Type": "application/json" };
    if (isProxyEnabled() && isIP && service?.invokeMethod.header) {
      const [key, value] = service.invokeMethod.header.split(":");
      Object.assign(headers, { [key]: value });
    }

    console.log("chatServiceUrl", chatServiceUrl);
    try {
      fetchEventSource(chatServiceUrl, {
        method: "POST",
        openWhenHidden: true,
        headers,
        body: JSON.stringify({
          model: serviceId,
          messages: [...messages, newMessage],
          stream: true,
          temperature,
          max_tokens,
          top_p,
          frequency_penalty,
          n,
          presence_penalty,
        }),
        signal: abortController.current.signal,
        onmessage: (event) => {
          if (event.data === "[DONE]") {
            setLoading(false);
          } else {
            const data = JSON.parse(event.data);
            setPending((state) => (state ?? "") + (data.choices[0].delta.content || ""));
          }
        },
        onerror: (err: AxiosError) => {
          const errorMessage = `Something went wrong: ${err.message || ""}`;
          setLoading(false);
          setIsError(true);
          setTempQuestion("");
          toast.error(errorMessage);
          throw new Error(errorMessage);
        },
      });
    } catch (e) {
      setLoading(false);
      setIsError(true);
      setTempQuestion("");
      toast.error("Something went wrong");
    }
  };

  const abort = useCallback(() => {
    abortController.current?.abort();
    setLoading(false);
    setTempQuestion("");
  }, []);

  const onRegenerate = useCallback(() => {
    const newMessages = [...messages];
    const lastConversation = newMessages.splice(-2);
    if (chatId) {
      updateHistoryMessages(chatId, newMessages);
      processQuestion(lastConversation[0].content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const tempConversation = [
    { role: "user", content: tempQuestion },
    {
      role: "assistant",
      content: pending || "",
    },
  ];

  useEffect(() => {
    if (!isLoading && pending) {
      setTempQuestion("");
      setPending(undefined);
      if (!chatId) {
        const newChatId = uuid();
        addHistory({
          id: newChatId,
          model: serviceId,
          title: tempConversation[0].content,
          messages: [...tempConversation],
          timestamp: Date.now(),
        });
        navigate(`/prem-chat/${serviceId}/${newChatId}`);
      } else {
        updateHistoryMessages(chatId, [...messages, ...tempConversation]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, isLoading]);

  const chatMessages = useMemo(() => {
    if (pending) {
      return [...messages, ...(pending ? tempConversation : [])];
    }
    if (tempQuestion) {
      return [...messages, { role: "user", content: tempQuestion }];
    }
    return messages;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, pending, tempQuestion]);

  const resetPromptTemplate = useCallback(() => {
    setPromptTemplate(service?.promptTemplate || "");
  }, [service, setPromptTemplate]);

  const resetChatServiceUrl = useCallback(() => {
    setChatServiceUrl(backendUrlState);
  }, [backendUrlState, setChatServiceUrl]);

  return {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
    resetPromptTemplate,
    resetChatServiceUrl,
    abort,
  };
};

export default usePremChatStream;
