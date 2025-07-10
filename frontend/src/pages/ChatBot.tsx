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

import { useState, useRef, useEffect } from "react";
import { PanelRight, PanelLeft, Send, Plus, Search } from "lucide-react";

type Message = {
  sender: "user" | "ai";
  content: string;
  timestamp: string;
};

type Conversation = {
  id: number;
  title: string;
  lastMessage: string;
};

function MessengerChat() {
  // États
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Données simulées
  useEffect(() => {
    setConversations([
      {
        id: 1,
        title: "Discussion technique",
        lastMessage: "Comment résoudre ce bug?",
      },
      {
        id: 2,
        title: "Support client",
        lastMessage: "Votre problème a été résolu",
      },
    ]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      sender: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulation réponse IA
    setTimeout(() => {
      const aiMsg: Message = {
        sender: "ai",
        content: getAIResponse(input),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Retard aléatoire entre 1-3s
  };

  const getAIResponse = (userInput: string): string => {
    const responses = [
      "Je comprends votre demande.",
      "Voici ce que je peux vous dire à ce sujet.",
      "C'est une excellente question!",
      "Je vais vérifier cela pour vous.",
      "D'après mes informations...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        fixed z-20 w-72 h-full bg-white border-r border-gray-200 transition-all duration-300
        md:relative md:translate-x-0 shadow-lg`}
      >
        <div className="p-4 space-y-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-12 top-4 p-2 bg-white rounded-lg shadow-md border border-gray-200
                      md:hidden hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </button>

          <button
            onClick={() => {
              setMessages([]);
              setInput("");
            }}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 
                      text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Nouvelle discussion
          </button>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Rechercher"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-180px)] p-2 space-y-1">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              onClick={() => {
                // Simuler le chargement d'une conversation
                setMessages([
                  {
                    sender: "ai",
                    content: `Bienvenue dans la conversation "${conv.title}"`,
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ]);
              }}
            >
              <div className="font-medium truncate">{conv.title}</div>
              <div className="text-sm text-gray-500 truncate">
                {conv.lastMessage}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 mr-2 rounded-lg hover:bg-gray-200 transition-colors
                      hidden md:block"
          >
            {sidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </button>
          <h1 className="text-xl font-semibold">Messenger Chat</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f0f2f5]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-center p-6 max-w-md">
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Send size={24} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-medium mb-2">
                  Envoyez votre premier message
                </h2>
                <p>
                  Commencez une nouvelle conversation ou sélectionnez une
                  discussion existante
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Écrivez un message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full 
                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MessengerChat;
