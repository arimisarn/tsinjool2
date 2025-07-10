"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  sender: "user" | "ai";
  content: string;
};

type Conversation = {
  id: number;
  title: string;
  created_at: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://tsinjool-backend.onrender.com/api/conversations/",
        {
          headers: {
            Authorization: token ? `Token ${token}` : "",
          },
        }
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Erreur récupération historique", err);
    }
  };

  const loadConversation = async (conv: Conversation) => {
    setConversationId(conv.id);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `https://ton-backend.onrender.com/api/conversations/${conv.id}/messages/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur chargement messages", err);
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const userMessage = { sender: "user" as const, content: input.trim() };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "https://tsinjool-backend.onrender.com/api/chat/",
        {
          prompt: userMessage.content,
          conversation_id: conversationId,
        },
        {
          headers: {
            Authorization: token ? `Token ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.conversation_id) {
        setConversationId(res.data.conversation_id);
        fetchConversations();
      }

      const aiMessage = {
        sender: "ai" as const,
        content: res.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Erreur avec l'IA." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 📚 Sidebar conversations */}
      <div className="w-64 border-r bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Conversations</h2>
          <Button variant="outline" size="sm" onClick={handleNewChat}>
            + Nouveau
          </Button>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[80vh]">
          {conversations.map((conv) => (
            <Button
              key={conv.id}
              variant={conv.id === conversationId ? "default" : "ghost"}
              onClick={() => loadConversation(conv)}
              className="w-full justify-start"
            >
              {conv.title || `Conversation #${conv.id}`}
            </Button>
          ))}
        </div>
      </div>

      {/* 💬 Zone de chat */}
      <div className="flex flex-col flex-1 max-w-4xl mx-auto h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-200 text-gray-900 italic">
                L’IA réfléchit...
                <span className="animate-pulse"> •••</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-4 border-t flex gap-2 bg-white"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message..."
            autoFocus
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  );
}
