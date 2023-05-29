import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import { Message, PremChatResponse } from "modules/prem-chat/types";
import { getChatCompletion } from "modules/prem-chat/api";
import usePremChatStore from "../store/prem-chat";
import useService from "./useService";

const usePremChatWithoutStream = (
  serviceId: string,
  chatId: string | null
): PremChatResponse => {
  const [question, setQuestion] = useState("");
  const [tempQuestion, setTempQuestion] = useState("");
  const navigate = useNavigate();
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
    presence_penalty
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

  const { isLoading, isError, mutate } = useMutation(
    (messages: Message[]) =>
      getChatCompletion(service?.runningPort!, {
        messages,
        model: serviceId,
        temperature: temperature || 0.5,
        top_p: top_p || 1.0,
        max_tokens: max_tokens || 256,
        frequency_penalty,
        stream: false,
        n: n || 1,
        presence_penalty
      }),
    {
      onSuccess: (response) => {
        const tempConversation = [
          {
            role: "user",
            content: tempQuestion,
          },
          {
            role: "assistant",
            content: response.data.choices[0].message.content,
          },
        ];
        if (!chatId) {
          const newConversationId = uuid();
          addHistory({
            id: newConversationId,
            model: serviceId,
            title: tempConversation[0].content,
            messages: [...tempConversation],
            timestamp: Date.now(),
          });
          navigate(`/prem-chat/${serviceId}/${newConversationId}`);
        } else {
          updateHistoryMessages(chatId, [...messages, ...tempConversation]);
        }
        setTempQuestion("");
      },
    }
  );

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
    const newMessages = [...messages, { role: "user", content: query }];
    setQuestion("");
    setTempQuestion(query);
    mutate(newMessages);
  };

  const chatMessages = useMemo(() => {
    if (tempQuestion) {
      return [...messages, { role: "user", content: tempQuestion }];
    }
    return messages;
  }, [messages, tempQuestion]);

  const onRegenerate = useCallback(() => {
    const newMessages = [...messages];
    const lastConversation = newMessages.splice(-2);
    if (chatId) {
      updateHistoryMessages(chatId, newMessages);
      processQuestion(lastConversation[0].content);
    }
  }, [messages]);

  return {
    chatMessages: chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
    onRegenerate,
  };
};

export default usePremChatWithoutStream;
