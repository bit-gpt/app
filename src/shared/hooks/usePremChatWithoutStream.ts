import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { chatCompletion } from "../api";
import { Message, PremChatResponse } from "../types";
import usePremChatStore from "../store/prem-chat";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";

const usePremChatWithoutStream = (chatId: string | null): PremChatResponse => {
  const [question, setQuestion] = useState("");
  const [tempQuestion, setTempQuestion] = useState("");
  const navigate = useNavigate();

  const { model, history, addHistory, updateHistoryMessages } =
    usePremChatStore(
      (state) => ({
        model: state.model,
        history: state.history,
        addHistory: state.addHistory,
        updateHistoryMessages: state.updateHistoryMessages,
      }),
      shallow
    );

  const messages =
    history.find((_history) => _history.id === chatId)?.messages || [];

  const { isLoading, isError, mutate } = useMutation(
    (messages: Message[]) => chatCompletion({ messages, model }),
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
            model,
            title: tempConversation[0].content,
            messages: [...tempConversation],
            timestamp: Date.now(),
          });
          navigate(`/prem-chat/${newConversationId}`);
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
      const query = question.trim();
      if (!query) {
        return;
      }
      const newMessages = [...messages, { role: "user", content: query }];
      setQuestion("");
      setTempQuestion(query);
      mutate(newMessages);
    },
    [question, mutate, messages, setQuestion, setTempQuestion]
  );

  const chatMessages = useMemo(() => {
    if (tempQuestion) {
      return [...messages, { role: "user", content: tempQuestion }];
    }
    return messages;
  }, [messages, tempQuestion]);

  return {
    chatMessages: chatMessages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    isError,
  };
};

export default usePremChatWithoutStream;
