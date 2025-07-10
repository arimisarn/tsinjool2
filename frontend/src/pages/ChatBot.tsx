"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  sender: "user" | "ai";
  content: string;
  timestamp?: string; // facultatif car parfois, on crée le message localement
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
                className={`relative max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
                style={{ paddingBottom: "1.5rem", paddingRight: "3rem" }} // espace pour l'heure
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* ⏰ Heure en bas à droite */}
                {msg.timestamp && (
                  <span className="text-xs text-gray-400 absolute bottom-1 right-2">
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





// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//   MessageCircle, 
//   Plus, 
//   Send, 
//   Menu,
//   Search,
//   Paperclip,
//   MoreHorizontal,
//   X
// } from "lucide-react";

// type Message = {
//   sender: "user" | "ai";
//   content: string;
//   timestamp?: string;
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
//   const [conversations, setConversations] = useState<Conversation[]>([
//     { id: 1, title: "Projet JavaScript", created_at: "2024-01-10T10:30:00Z" },
//     { id: 2, title: "Questions Python", created_at: "2024-01-09T14:15:00Z" },
//     { id: 3, title: "Aide CSS", created_at: "2024-01-08T09:45:00Z" },
//     { id: 4, title: "Base de données", created_at: "2024-01-07T16:20:00Z" },
//   ]);
//   console.log(setConversations);
  
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Scroll automatique vers le bas
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const loadConversation = (conv: Conversation) => {
//     setConversationId(conv.id);
//     setMessages([
//       { sender: "user", content: "Bonjour ! J'ai besoin d'aide.", timestamp: "2024-01-10T10:30:00Z" },
//       { sender: "ai", content: "Bonjour ! Je suis là pour vous aider. Que puis-je faire pour vous ?", timestamp: "2024-01-10T10:31:00Z" }
//     ]);
//     setSidebarOpen(false);
//   };

//   const handleNewChat = () => {
//     setConversationId(null);
//     setMessages([]);
//     setSidebarOpen(false);
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user" as const, content: input.trim() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);

//     // Simulation d'une réponse de l'IA
//     setTimeout(() => {
//       const aiMessage = {
//         sender: "ai" as const,
//         content: "Je comprends votre question. Laissez-moi vous aider avec ça...",
//       };
//       setMessages((prev) => [...prev, aiMessage]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const filteredConversations = conversations.filter(conv =>
//     conv.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const formatTime = (timestamp: string) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
//     if (messageDate.getTime() === today.getTime()) {
//       return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     } else {
//       return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white/80 backdrop-blur-sm shadow-lg transition-transform duration-300 ease-in-out`}>
//         {/* Header */}
//         <div className="p-4 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
//                 <MessageCircle className="w-4 h-4 text-white" />
//               </div>
//               <h1 className="text-lg font-semibold text-gray-800">Conversations</h1>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleNewChat}
//                 className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
//               >
//                 <Plus className="w-4 h-4 mr-1" />
//                 Nouveau
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setSidebarOpen(false)}
//                 className="lg:hidden"
//               >
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
          
//           {/* Search */}
//           <div className="relative mt-3">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Rechercher..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
//             />
//           </div>
//         </div>

//         {/* Conversations List */}
//         <div className="p-2 h-full overflow-y-auto">
//           <div className="space-y-1">
//             {filteredConversations.map((conv) => (
//               <button
//                 key={conv.id}
//                 onClick={() => loadConversation(conv)}
//                 className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
//                   conv.id === conversationId
//                     ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
//                     : "hover:bg-gray-50"
//                 }`}
//               >
//                 <div className="flex items-center gap-3 w-full">
//                   <Avatar className="w-8 h-8">
//                     <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white text-xs">
//                       {conv.title ? conv.title.substring(0, 2).toUpperCase() : `#${conv.id}`}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 text-left">
//                     <div className="font-medium text-sm truncate">
//                       {conv.title || `Conversation #${conv.id}`}
//                     </div>
//                     <div className={`text-xs ${
//                       conv.id === conversationId ? "text-purple-100" : "text-gray-500"
//                     }`}>
//                       {formatTime(conv.created_at)}
//                     </div>
//                   </div>
//                   {conv.id === conversationId && (
//                     <Badge variant="secondary" className="text-xs bg-white/20 text-white">
//                       Active
//                     </Badge>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Overlay for mobile */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Main Chat Area */}
//       <div className="flex flex-col flex-1 bg-white/50 backdrop-blur-sm lg:ml-0">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setSidebarOpen(true)}
//               className="lg:hidden"
//             >
//               <Menu className="w-5 h-5" />
//             </Button>
//             <div className="flex items-center gap-2">
//               <Avatar className="w-8 h-8">
//                 <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
//                   AI
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <h2 className="font-semibold text-gray-800">ChatBot IA</h2>
//                 <p className="text-xs text-gray-500">En ligne</p>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="sm">
//               <MoreHorizontal className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.length === 0 && (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <MessageCircle className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Commencer une conversation</h3>
//                 <p className="text-gray-500">Tapez votre message pour commencer à discuter avec l'IA</p>
//               </div>
//             </div>
//           )}

//           {messages.map((msg, i) => (
//             <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//               <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback className={`${
//                     msg.sender === "user" 
//                       ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
//                       : "bg-gray-200 text-gray-600"
//                   }`}>
//                     {msg.sender === "user" ? "U" : "AI"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <Card className={`${
//                   msg.sender === "user"
//                     ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg"
//                     : "bg-white shadow-sm border-gray-200"
//                 }`}>
//                   <CardContent className="p-3">
//                     <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
//                     {msg.timestamp && (
//                       <p className={`text-xs mt-1 ${
//                         msg.sender === "user" ? "text-purple-100" : "text-gray-500"
//                       }`}>
//                         {formatTime(msg.timestamp)}
//                       </p>
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           ))}

//           {isTyping && (
//             <div className="flex justify-start">
//               <div className="flex items-end gap-2">
//                 <Avatar className="w-8 h-8">
//                   <AvatarFallback className="bg-gray-200 text-gray-600">AI</AvatarFallback>
//                 </Avatar>
//                 <Card className="bg-white shadow-sm border-gray-200">
//                   <CardContent className="p-3">
//                     <div className="flex items-center gap-2">
//                       <div className="flex space-x-1">
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
//                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                       </div>
//                       <span className="text-xs text-gray-500">L'IA réfléchit...</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input */}
//         <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
//           <div className="flex items-center gap-2">
//             <div className="flex-1 relative">
//               <Input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Tapez votre message..."
//                 className="pr-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-300 transition-colors"
//                 autoFocus
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8"
//               >
//                 <Paperclip className="w-4 h-4 text-gray-400" />
//               </Button>
//             </div>
//             <Button
//               type="button"
//               onClick={sendMessage}
//               disabled={!input.trim() || isTyping}
//               className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg disabled:opacity-50"
//             >
//               <Send className="w-4 h-4 mr-1" />
//               Envoyer
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }