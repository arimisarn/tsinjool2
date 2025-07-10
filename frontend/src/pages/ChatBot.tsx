// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// type Message = {
//   sender: "user" | "ai";
//   content: string;
//   timestamp?: string; // facultatif car parfois, on crée le message localement
// };

// type Conversation = {
//   id: number;
//   title: string;
//   created_at: string;
// };

// export default function ChatBot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [conversationId, setConversationId] = useState<number | null>(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [conversations, setConversations] = useState<Conversation[]>([]);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Scroll automatique vers le bas
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   useEffect(() => {
//     fetchConversations();
//   }, []);

//   const fetchConversations = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         "https://tsinjool-backend.onrender.com/api/conversations/",
//         {
//           headers: {
//             Authorization: token ? `Token ${token}` : "",
//           },
//         }
//       );
//       setConversations(res.data);
//     } catch (err) {
//       console.error("Erreur récupération historique", err);
//     }
//   };

//   const loadConversation = async (conv: Conversation) => {
//     setConversationId(conv.id);

//     const token = localStorage.getItem("token");

//     try {
//       const res = await axios.get(
//         `https://ton-backend.onrender.com/api/conversations/${conv.id}/messages/`,
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setMessages(res.data);
//     } catch (err) {
//       console.error("Erreur chargement messages", err);
//       setMessages([]);
//     }
//   };

//   const handleNewChat = () => {
//     setConversationId(null);
//     setMessages([]);
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const token = localStorage.getItem("token");
//     const userMessage = { sender: "user" as const, content: input.trim() };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);

//     try {
//       const res = await axios.post(
//         "https://tsinjool-backend.onrender.com/api/chat/",
//         {
//           prompt: userMessage.content,
//           conversation_id: conversationId,
//         },
//         {
//           headers: {
//             Authorization: token ? `Token ${token}` : "",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (res.data.conversation_id) {
//         setConversationId(res.data.conversation_id);
//         fetchConversations();
//       }

//       const aiMessage = {
//         sender: "ai" as const,
//         content: res.data.response,
//       };
//       setMessages((prev) => [...prev, aiMessage]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "ai", content: "Erreur avec l'IA." },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div className="flex h-screen bg-slate-50">
//       {/* 📚 Sidebar conversations */}
//       <div className="w-64 border-r bg-white p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold">Conversations</h2>
//           <Button variant="outline" size="sm" onClick={handleNewChat}>
//             + Nouveau
//           </Button>
//         </div>

//         <div className="space-y-2 overflow-y-auto max-h-[80vh]">
//           {conversations.map((conv) => (
//             <Button
//               key={conv.id}
//               variant={conv.id === conversationId ? "default" : "ghost"}
//               onClick={() => loadConversation(conv)}
//               className="w-full justify-start"
//             >
//               {conv.title || `Conversation #${conv.id}`}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* 💬 Zone de chat */}
//       <div className="flex flex-col flex-1 max-w-4xl mx-auto h-full">
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 msg.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
//                   msg.sender === "user"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-200 text-gray-900"
//                 }`}
//                 style={{ paddingBottom: "1.5rem", paddingRight: "3rem" }} // espace pour l'heure
//               >
//                 <p className="whitespace-pre-wrap">{msg.content}</p>

//                 {/* ⏰ Heure en bas à droite */}
//                 {msg.timestamp && (
//                   <span className="text-xs text-gray-400 absolute bottom-1 right-2">
//                     {new Date(msg.timestamp).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-200 text-gray-900 italic">
//                 L’IA réfléchit...
//                 <span className="animate-pulse"> •••</span>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             sendMessage();
//           }}
//           className="p-4 border-t flex gap-2 bg-white"
//         >
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             placeholder="Tapez votre message..."
//             autoFocus
//             className="flex-1"
//           />
//           <Button type="submit" disabled={!input.trim()}>
//             Envoyer
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Plus, PanelRight, PanelLeft } from "lucide-react";
import chatbotGif from "@/public/images/chatbot.gif";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!sidebarOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sidebarOpen]);

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

    if (messageCache[conv.id]) {
      setMessages(messageCache[conv.id]);
      return;
    }

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
      setMessageCache((prev) => ({ ...prev, [conv.id]: res.data }));
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur chargement messages", err);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
    if (inputRef.current) inputRef.current.focus();
  };

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

      const aiMessage = {
        sender: "ai" as const,
        content: res.data.response,
      };

      const newConvId = res.data.conversation_id || conversationId!;
      const updatedMessages = [
        ...(messageCache[newConvId] || []),
        userMessage,
        aiMessage,
      ];

      setConversationId(newConvId);
      setMessages(updatedMessages);
      setMessageCache((prev) => ({
        ...prev,
        [newConvId]: updatedMessages,
      }));

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  console.log(handleKeyDown);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (messageCache[conv.id]?.[0]?.content
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false)
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar with Framer Motion animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-gray-900 text-gray-100 flex flex-col p-2 border-r border-gray-700"
          >
            <div className="p-2">
              <Button
                onClick={handleNewChat}
                className="w-full justify-start gap-2 border border-gray-600 hover:bg-gray-700"
              >
                <Plus size={16} />
                Nouveau chat
              </Button>
            </div>

            <div className="px-2 pb-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un chat..."
                  className="w-full pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 px-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-all text-sm ${
                    conv.id === conversationId
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-800/50 text-gray-300"
                  }`}
                >
                  <div className="font-medium truncate flex items-center gap-2">
                    <span className="flex-1 truncate">
                      {conv.title || `Conversation #${conv.id}`}
                    </span>
                  </div>
                  <div className="text-xs truncate text-gray-400 mt-1">
                    {messageCache[conv.id]?.slice(-1)[0]?.content ||
                      "Aucun message"}
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col bg-gray-800 relative">
        {/* Header with PanelRight/PanelLeft button */}
        <header className="h-14 flex items-center px-4 border-b border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
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

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isTyping ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="mb-6">
                {/* Replace with your actual GIF - this is a placeholder */}
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {/* <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg> */}
                  <div className="mb-6 w-40 h-40">
                    <img
                      src={chatbotGif}
                      alt="Assistant IA"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-2">
                Comment puis-je vous aider aujourd'hui ?
              </h2>
              <p className="text-gray-400 max-w-md">
                Posez-moi n'importe quelle question ou discutez avec moi sur
                n'importe quel sujet.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-700 text-white rounded-bl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
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
                  <div className="max-w-xs bg-gray-700 text-white rounded-lg rounded-bl-none px-4 py-2">
                    <div className="flex items-center">
                      <span className="mr-2">L'IA écrit...</span>
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* Input area */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Envoyer un message..."
                className="w-full pr-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-0 focus:outline-none focus:border-gray-500"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-transparent hover:bg-gray-600 text-gray-400 hover:text-white"
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              ChatGPT peut faire des erreurs. Vérifiez les informations
              importantes.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
