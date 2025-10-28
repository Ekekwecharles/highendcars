"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Message {
  id: string;
  sender: string;
  text: string;
  created_at: string;
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 320px;
  height: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 999;
`;

const Header = styled.div`
  background: #0070f3;
  color: white;
  padding: 12px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Messages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f6f7fb;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div<{ sender: string }>`
  align-self: ${({ sender }) =>
    sender === "customer" ? "flex-end" : "flex-start"};
  background: ${({ sender }) =>
    sender === "customer" ? "#0070f3" : "#e2e3e5"};
  color: ${({ sender }) => (sender === "customer" ? "white" : "black")};
  padding: 8px 10px;
  border-radius: 12px;
  max-width: 70%;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: white;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
`;

const SendButton = styled.button`
  margin-left: 8px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;

  &:hover {
    background: #0059c1;
  }
`;

export default function ChatWindow({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // Load or create conversation
  useEffect(() => {
    const initConversation = async () => {
      // Try to find an existing conversation
      const { data: existing } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(); // doesn't crash if none found

      if (existing) {
        setConversationId(existing.id);
        return;
      }

      // Try to create one
      try {
        const { data: newConv } = await supabase
          .from("conversations")
          .insert([{ user_id: userId }])
          .select()
          .single();

        setConversationId(newConv.id);
      } catch (error: any) {
        // If it failed because someone else created it just now...
        if (error.code === "23505") {
          const { data: existingNow } = await supabase
            .from("conversations")
            .select("*")
            .eq("user_id", userId)
            .single();

          setConversationId(existingNow.id);
        } else {
          console.error(error);
        }
      }
    };

    initConversation();
  }, [userId]);

  //Load messages for this conversation
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data as Message[]);
    };

    fetchMessages();

    // Subscribe to new messages for this conversation
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;
    await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        sender: "customer",
        text: input,
      },
    ]);
    setInput("");
  };

  return (
    <Wrapper>
      <Header>
        <span>Customer Support</span>
        <button
          onClick={onClose}
          style={{
            color: "white",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </Header>

      <Messages>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} sender={msg.sender}>
            {msg.text}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </Messages>

      <InputWrapper>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputWrapper>
    </Wrapper>
  );
}
