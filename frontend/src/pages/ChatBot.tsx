"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Plus, PanelRight, PanelLeft } from "lucide-react";
import chatbotGif from "@/public/images/chatbot.gif";
import { motion, AnimatePresence } from "framer-motion";


// interface UserProfile {
//   name: string;
//   photo?: string;
//   bio?: string;
//   coaching_type: string;
//   level: number;
//   points: number;
// }

type Message = {
  sender: "user" | "ai";
  content: string;
  timestamp?: string;
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
  const [messageCache, setMessageCache] = useState<{
    [key: number]: Message[];
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatique en bas à chaque nouveau message ou changement d'état typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Chargement initial des conversations + chargement de la première conversation si existe
  useEffect(() => {
    const fetchAndLoad = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://tsinjool-backend.onrender.com/api/conversations/",
          {
            headers: { Authorization: token ? `Token ${token}` : "" },
          }
        );
        setConversations(res.data);

        if (res.data.length > 0) {
          await loadConversation(res.data[0]);
        } else {
          setConversationId(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Erreur récupération historique", err);
      }
    };
    fetchAndLoad();
  }, []);

  useEffect(() => {
    if (!sidebarOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sidebarOpen]);

  // Charge les messages d'une conversation donnée, avec cache
  const loadConversation = async (conv: Conversation) => {
    setConversationId(conv.id);

    if (messageCache[conv.id]) {
      setMessages(messageCache[conv.id]);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `https://tsinjool-backend.onrender.com/api/conversations/${conv.id}/messages/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setMessageCache((prev) => ({ ...prev, [conv.id]: res.data }));
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur chargement messages", err);
      setMessages([]);
    }
  };

  // Démarre une nouvelle conversation
  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  // Envoi d'un message à l'API, mise à jour du cache et affichage
  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const userMessage = { sender: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInput("");

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

      const aiMessage = { sender: "ai" as const, content: res.data.response };
      const newConvId = res.data.conversation_id || conversationId!;
      const updatedMessages = [
        ...(messageCache[newConvId] || []),
        userMessage,
        aiMessage,
      ];

      setConversationId(newConvId);
      setMessages(updatedMessages);
      setMessageCache((prev) => ({ ...prev, [newConvId]: updatedMessages }));

      // Rafraîchir la liste des conversations après ajout
      fetchConversations();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "Erreur avec l'IA." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Recharge les conversations (utile après un nouveau chat)
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://tsinjool-backend.onrender.com/api/conversations/",
        {
          headers: { Authorization: token ? `Token ${token}` : "" },
        }
      );
      setConversations(res.data);
    } catch (err) {
      console.error("Erreur récupération historique", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (messageCache[conv.id]?.[0]?.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false)
  );

  return (
    <div className="flex h-[80vh] bg-white dark:bg-zinc-900 text-gray-900 dark:text-white overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-zinc-700 p-2 flex flex-col"
          >
            <div className="p-2">
              <Button
                onClick={handleNewChat}
                className="w-full gap-2 border dark:text-white text-gray-900 dark:bg-zinc-900 bg-gray-50 border-gray-400  hover:bg-gray-100 dark:border-zinc-600  "
              >
                <Plus size={16} /> Nouveau chat
              </Button>
            </div>

            <div className="px-2 pb-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  size={16}
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un chat..."
                  className="w-full pl-9 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 px-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv)}
                  className={`w-full text-left px-3 py-3 rounded-md text-sm transition-all ${
                    conv.id === conversationId
                      ? "bg-gray-300 dark:bg-zinc-700 text-gray-900 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="font-medium truncate">
                    {conv.title || `Conversation #${conv.id}`}
                  </div>
                  <div className="text-xs truncate text-gray-500 dark:text-gray-400">
                    {messageCache[conv.id]?.slice(-1)[0]?.content ||
                      "Aucun message"}
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
        <header className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </Button>
          <h1 className="ml-2 font-semibold">
            {conversationId
              ? conversations.find((c) => c.id === conversationId)?.title ||
                "Chat"
              : "Nouveau chat"}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-40 h-40 mb-4">
                <img
                  src={chatbotGif}
                  alt="Assistant IA"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Comment puis-je vous aider aujourd'hui ?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Posez-moi n'importe quelle question ou discutez avec moi sur
                n'importe quel sujet.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl rounded-lg px-4 py-2 whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                    {msg.timestamp && (
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-lg px-4 py-2">
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        {[0, 150, 300].map((d, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"
                            style={{ animationDelay: `${d}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="w-full"
          >
            <div className="relative w-full mb-4 px-4 flex">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Envoyer un message..."
                className="w-full rounded-l-md rounded-r-none bg-gray-100 dark:bg-gray-800 border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 h-12"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="rounded-r-md rounded-l-none h-12 w-12 bg-purple-700 hover:bg-purple-600 dark:hover:bg-purple-500 text-white"
              >
                <Send size={16} />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
