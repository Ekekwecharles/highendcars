"use client";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { supabase } from "@/lib/supabaseClient";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface Conversation {
  id: string;
  user_id: string;
  nickname: string;
  is_resolved: boolean;
  last_message: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  created_at: string;
}

const Container = styled.div`
  display: flex;
  gap: 24px;
  padding: 24px;
`;

const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #ccc;
`;

const ConversationItem = styled.div<{ $active?: boolean }>`
  padding: 12px;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.conversationBg : "transparent"};
  border-bottom: 1px solid #eee;
`;

const ChatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  align-self: stretch;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Messages = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageBubble = styled.div<{ sender: string }>`
  align-self: ${({ sender }) =>
    sender === "admin" ? "flex-end" : "flex-start"};
  background: ${({ sender }) => (sender === "admin" ? "#4caf50" : "#0070f3")};
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
  padding: 6px 12px;
  background: #4caf50;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  &:hover {
    background: #3c8c42;
  }
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  margin-left: 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

export default function AdminSupport() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  });

  // Load conversations
  const fetchConversations = async () => {
    const { data } = await supabase
      .from("conversations")
      .select(
        `
        id,
        user_id,
        is_resolved,
        created_at,
        users(nickname, email),
        messages(created_at)
      `
      )
      .order("created_at", { ascending: true });

    if (data) {
      setConversations(
        data.map((c: any) => ({
          id: c.id,
          user_id: c.user_id,
          nickname: (() => {
            const emailName = c.users?.email?.split("@")[0];
            const displayName =
              emailName.length > 7 ? `${emailName.slice(0, 7)}...` : emailName;
            return c.users?.nickname || displayName;
          })(),
          is_resolved: c.is_resolved,
          last_message:
            c.messages?.[c.messages.length - 1]?.created_at || c.created_at,
        }))
      );
    }
  };

  useEffect(() => {
    fetchConversations();

    // Subscribe to new conversations
    const convChannel = supabase
      .channel("realtime:conversations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "conversations" },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(convChannel);
    }
  }, []);

  // Load messages for selected conversation
  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (data) setMessages(data as Message[]);
  };

  // Listen to new messages in real-time
  useEffect(() => {
    if (!selectedConv) return;
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConv.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, [selectedConv]);

  const selectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    fetchMessages(conv.id);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedConv) return;

    await supabase
      .from("messages")
      .insert([
        { conversation_id: selectedConv.id, sender: "admin", text: input },
      ]);
    setInput("");
  };

  const resolveConversation = async () => {
    if (!selectedConv) return;
    await supabase
      .from("conversations")
      .update({ is_resolved: true })
      .eq("id", selectedConv.id);
    await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", selectedConv.id);
    setSelectedConv(null);
    fetchConversations();
  };

  const clearConversation = async () => {
    if (!selectedConv) return;
    await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", selectedConv.id);
    setMessages([]);
  };

  return (
    <Container>
      <Sidebar>
        <h3>Conversations</h3>
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            $active={selectedConv?.id === c.id}
            onClick={() => selectConversation(c)}
          >
            {c.nickname} {c.is_resolved ? "(Resolved)" : ""}
          </ConversationItem>
        ))}
      </Sidebar>

      <ChatBox>
        <Messages>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} sender={msg.sender}>
              {msg.text}
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </Messages>

        {selectedConv && (
          <InputWrapper>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <SendButton onClick={sendMessage}>Send</SendButton>
            <ActionButton onClick={clearConversation}>Clear</ActionButton>
            <ActionButton onClick={resolveConversation}>Resolve</ActionButton>
          </InputWrapper>
        )}
      </ChatBox>
    </Container>
  );
}
