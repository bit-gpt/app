import { useEffect, useMemo, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useMutation } from "@tanstack/react-query";
import { chatCompletion } from "../api";
import { Message } from "../types";
import usePremChatStore from "../store/prem-chat";
import { v4 as uuid } from "uuid";
import { shallow } from "zustand/shallow";

const usePremChatStream = (chatId: string | null) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(chatId);


  const { model, setHistory, history } = usePremChatStore(
    (state) => ({
      model: state.model,
      setHistory: state.setHistory,
      history: state.history,
    }),
    shallow
  );

  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
  }>({
    messages: [],
  });

  useEffect(() => {
    if (
      messageState.messages.length > 0 &&
      messageState.messages[messageState.messages.length - 1].role ===
        "assistant"
    ) {
      if (!conversationId) {
        const newConversationId = uuid();
        setHistory([
          ...history,
          {
            id: newConversationId,
            model,
            title: messageState.messages[0].content,
            messages: messageState.messages,
          },
        ]);
        setConversationId(newConversationId);
      } else {
        const newhistory = history.map((_history) => {
          if (_history.id === conversationId) {
            return {
              ..._history,
              messages: messageState.messages,
            };
          }
          return _history;
        });
        setHistory(newhistory);
      }
    }
  }, [conversationId, messageState.messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = question.trim();
    if (!query) {
      return;
    }

    const newMessage = { role: "user", content: query };

    setQuestion("");
    setMessageState((state) => ({
      ...state,
      messages: [...state.messages, newMessage],
      pending: undefined,
    }));
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
          }),
          signal: ctrl.signal,
          onmessage: (event) => {
            if (event.data === "[DONE]") {
              setMessageState((state) => ({
                messages: [
                  ...state.messages,
                  {
                    role: "assistant",
                    content: state.pending ?? "",
                  },
                ],
                pending: undefined,
              }));
              setLoading(false);

              ctrl.abort();
            } else {
              const data = JSON.parse(event.data);
              setMessageState((state) => ({
                ...state,
                pending:
                  (state.pending ?? "") + (data.choices[0].delta.content || ""),
              }));
            }
          },
        }
      );
    } catch (e) {
      console.log("error", e);
      setLoading(false);
      setError("An error occurred while fetching the data. Please try again.");
    }
  };

  const { messages, pending } = messageState;

  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending
        ? [
            {
              role: "assistant",
              content: pending,
            },
          ]
        : []),
    ];
  }, [messages, pending]);

  return { chatMessages, onSubmit, question, setQuestion, isLoading, error };
};

const usePremChatWithoutStream = (chatId: string | null) => {
  const [question, setQuestion] = useState("");
  const model = usePremChatStore((state) => state.model);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(chatId);

  const { isLoading, error, mutate } = useMutation(
    (messages: Message[]) => chatCompletion({ messages, model }),
    {
      onSuccess: (response) => {
        setMessages((state) => [...state, response.data.choices[0].message]);
      },
    }
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = question.trim();
    if (!query) {
      return;
    }
    const newMessages = [...messages, { role: "user", content: query }];
    setQuestion("");
    setMessages(newMessages);
    mutate(newMessages);
  };

  return {
    chatMessages: messages,
    onSubmit,
    question,
    setQuestion,
    isLoading,
    error,
  };
};

const usePremChat = (chatId: string | null) => {
  return +import.meta.env.VITE_ENABLE_STREAMING
    ? usePremChatStream(chatId)
    : usePremChatWithoutStream(chatId);
};

export default usePremChat;
