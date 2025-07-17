import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Settings } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { aiService } from '@/services/aiService';
import { VoiceButton } from '@/components/clients/VoiceButton';
import { AudioVisualizer } from '@/components/clients/AudioVisualizer';
import { ConversationHistory } from '@/components/clients/ConversationHistory';
import { StatusIndicator } from '@/components/clients/StatusIndicator';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

function ChatVoice() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechRecognitionSupported
  } = useSpeechRecognition();

  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    isSupported: speechSynthesisSupported
  } = useSpeechSynthesis();

  // Gérer le statut de connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Traiter le transcript quand l'utilisateur arrête de parler
  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleUserMessage(transcript);
    }
  }, [transcript, isListening, isProcessing]);

  const handleUserMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setError('');
    setIsProcessing(true);
    
    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    resetTranscript();

    try {
      // Obtenir la réponse de l'IA
      const aiResponse = await aiService.sendMessage(message);
      
      if (aiResponse.error) {
        setError(aiResponse.response);
      } else {
        // Ajouter la réponse de l'IA
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Parler la réponse
        if (speechSynthesisSupported) {
          speak(aiResponse.response);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setError('Erreur lors du traitement de votre message.');
    } finally {
      setIsProcessing(false);
    }
  }, [resetTranscript, speak, speechSynthesisSupported]);

  const handleStopSpeaking = () => {
    cancelSpeech();
  };

  const isSystemReady = speechRecognitionSupported && speechSynthesisSupported && isOnline;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              IA Vocale
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Parlez naturellement avec votre assistant IA
          </p>
        </motion.header>

        {/* Status Bar */}
        <motion.div 
          className="flex justify-between items-center mb-8 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatusIndicator isOnline={isOnline} error={error} />
          <div className="flex items-center space-x-4">
            <AudioVisualizer isActive={isListening} />
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">{messages.length} messages</span>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Conversation History */}
        <motion.div 
          className="mb-8 h-96 overflow-y-auto p-4 bg-gray-800/30 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Aucune conversation pour le moment</p>
                <p className="text-sm mt-2">Cliquez sur le micro pour commencer</p>
              </div>
            </div>
          ) : (
            <ConversationHistory messages={messages} />
          )}
        </motion.div>

        {/* Voice Controls */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <VoiceButton
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
            onStopSpeaking={handleStopSpeaking}
            disabled={!isSystemReady || isProcessing}
          />
        </motion.div>

        {/* System Status */}
        {!isSystemReady && (
          <motion.div 
            className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-yellow-400">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configuration requise:</span>
            </div>
            <ul className="mt-2 text-sm text-yellow-300 space-y-1">
              {!speechRecognitionSupported && (
                <li>• Reconnaissance vocale non supportée par votre navigateur</li>
              )}
              {!speechSynthesisSupported && (
                <li>• Synthèse vocale non supportée par votre navigateur</li>
              )}
              {!isOnline && (
                <li>• Connexion Internet requise</li>
              )}
            </ul>
          </motion.div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <motion.div 
            className="fixed bottom-4 right-4 p-4 bg-blue-600 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5" />
              </motion.div>
              <span className="text-sm">IA en réflexion...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ChatVoice;