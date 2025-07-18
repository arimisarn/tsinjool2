import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Message } from "@/types";

interface MessageHistoryProps {
  messages: Message[];
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ messages }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Historique des conversations
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-100"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageHistory;
