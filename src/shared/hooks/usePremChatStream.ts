import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { PremChatResponse } from "../types";
import usePremChatStore from "../store/prem-chat";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";

const usePremChatStream = (chatId: string | null): PremChatResponse => {
  const [question, setQuestion] = useState("");
  const [tempQuestion, setTempQuestion] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const navigate = useNavigate();
  const [pending, setPending] = useState<string | null>();

  const {
    model,
    history,
    addHistory,
    updateHistoryMessages,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
  } = usePremChatStore(
    (state) => ({
      model: state.model,
      history: state.history,
      addHistory: state.addHistory,
      updateHistoryMessages: state.updateHistoryMessages,
      temperature: state.temperature,
      max_tokens: state.max_tokens,
      top_p: state.top_p,
      frequency_penalty: state.frequency_penalty,
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

    try {
      fetchEventSource(
        `${import.meta.env.VITE_BACKEND_NEW_URL}/v1/chat/completions`,
        {
          method: "POST",
          openWhenHidden: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_BACKEND_TOKEN,
          },
          body: JSON.stringify({
            model,
            messages: [...messages, newMessage],
            stream: true,
            temperature,
            max_tokens,
            top_p,
            frequency_penalty,
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
        }
      );
    } catch (e) {
      setLoading(false);
      setIsError(true);
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
          model,
          title: tempConversation[0].content,
          messages: [...tempConversation],
          timestamp: Date.now(),
        });
        navigate(`/prem-chat/${newChatId}`);
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
