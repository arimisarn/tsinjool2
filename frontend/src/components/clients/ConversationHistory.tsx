import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ConversationHistoryProps {
  messages: Message[];
  className?: string;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  messages, 
  className = '' 
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-100'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-xs opacity-70 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};