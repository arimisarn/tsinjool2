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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  console.log(handleNewChat);

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
    <div className="flex h-screen overflow-hidden bg-white">
      {/* 📁 Sidebar gauche */}
      <div className="w-72 border-r bg-slate-50 p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tickets</h2>
        <div className="space-y-2 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                conv.id === conversationId
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium truncate">
                  {conv.title || `Conversation #${conv.id}`}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(conv.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="text-sm truncate text-gray-300">
                {messages.length > 0 && conv.id === conversationId
                  ? messages[messages.length - 1]?.content
                  : "No messages yet"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 💬 Zone de chat */}
      <div className="flex-1 flex flex-col">
        {/* 🔘 Header avec actions */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
          <div className="text-lg font-medium text-gray-800">
            {conversations.find((c) => c.id === conversationId)?.title ||
              "Nouvelle conversation"}
          </div>
          <div className="space-x-2">
            <Button variant="outline">Edit</Button>
            <Button variant="destructive">Close Ticket</Button>
          </div>
        </div>

        {/* 📥 Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-blue-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl shadow ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-800"
                } relative`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.timestamp && (
                  <span className="text-xs text-gray-300 absolute bottom-1 right-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-sm px-4 py-2 rounded-xl bg-white text-gray-800 italic">
                L’IA réfléchit... <span className="animate-pulse">•••</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 📨 Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-4 border-t bg-white flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
