import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";
import { PremChatResponse } from "modules/prem-chat/types";
import usePremChatStore from "../store/prem-chat";
import useService from "./useService";
import { toast } from "react-toastify";
import { getBackendUrlFromStore } from "shared/store/setting";

const usePremChatStream = (
  serviceId: string,
  chatId: string | null
): PremChatResponse => {
  const [question, setQuestion] = useState("");
  const [tempQuestion, setTempQuestion] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [pending, setPending] = useState<string | null>();
  const { data: response } = useService(serviceId);
  const service = response?.data;

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
    }),
    shallow
  );

  const messages =
    history.find((_history) => _history.id === chatId)?.messages || [];

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      processQuestion(question);
    },
    [question]
  );

  const processQuestion = (question: string) => {
    const query = question.trim();
    if (!query) {
      return;
    }
    setTempQuestion(query);
    setQuestion("");
    const newMessage = { role: "user", content: query };
    setPending(undefined);
    setLoading(true);
    const ctrl = new AbortController();

    const backendUrl = new URL(getBackendUrlFromStore());
    backendUrl.port = `${service?.runningPort!}`;

    try {
      fetchEventSource(`${backendUrl}api/v1/chat/completions`, {
        method: "POST",
        openWhenHidden: true,
        headers: {
          "Content-Type": "application/json",
        },
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
        signal: ctrl.signal,
        onmessage: (event) => {
          if (event.data === "[DONE]") {
            setLoading(false);
          } else {
            const data = JSON.parse(event.data);
            setPending(
              (state) => (state ?? "") + (data.choices[0].delta.content || "")
            );
          }
        },
        onerror: () => {
          setLoading(false);
          setIsError(true);
          setTempQuestion("");
          toast.error("Something went wrong");
          throw new Error("Something went wrong");
        },
      });
    } catch (e) {
      setLoading(false);
      setIsError(true);
      setTempQuestion("");
      toast.error("Something went wrong");
    }
  };

  const onRegenerate = useCallback(() => {
    const newMessages = [...messages];
    const lastConversation = newMessages.splice(-2);
    if (chatId) {
      updateHistoryMessages(chatId, newMessages);
      processQuestion(lastConversation[0].content);
    }
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
  }, [pending, isLoading]);

  const chatMessages = useMemo(() => {
    if (pending) {
      return [...messages, ...(pending ? tempConversation : [])];
    }
    if (tempQuestion) {
      return [...messages, { role: "user", content: tempQuestion }];
    }
    return messages;
  }, [messages, pending, tempQuestion]);

  return {
    chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
  };
};

export default usePremChatStream;
