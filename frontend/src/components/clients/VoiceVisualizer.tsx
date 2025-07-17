import React from 'react';
import { motion } from 'framer-motion';

interface VoiceVisualizerProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isProcessing,
  isSpeaking
}) => {
  const getStateColor = () => {
    if (isListening) return 'bg-green-500';
    if (isProcessing) return 'bg-yellow-500';
    if (isSpeaking) return 'bg-blue-500';
    return 'bg-gray-300';
  };

  const getStateText = () => {
    if (isListening) return 'Écoute...';
    if (isProcessing) return 'Réflexion...';
    if (isSpeaking) return 'Parle...';
    return 'En attente';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        className={`w-32 h-32 rounded-full ${getStateColor()} flex items-center justify-center shadow-lg`}
        animate={{
          scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.8,
          repeat: isListening || isSpeaking ? Infinity : 0,
        }}
      >
        <motion.div
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
          animate={{
            scale: isProcessing ? [1, 0.8, 1] : 1,
          }}
          transition={{
            duration: 0.6,
            repeat: isProcessing ? Infinity : 0,
          }}
        >
          {isListening && (
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
          {isProcessing && (
            <svg className="w-8 h-8 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSpeaking && (
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.816a1 1 0 011.617.816zm2.754 2.04A1 1 0 0112 4v12a1 1 0 01-1.617.816L6.617 13H4a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.816a1 1 0 011.617.816zm2.754 2.04A1 1 0 0112 4v12a1 1 0 01-1.617.816L6.617 13H4a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.816a1 1 0 011.617.816z" clipRule="evenodd" />
            </svg>
          )}
          {!isListening && !isProcessing && !isSpeaking && (
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
      </motion.div>
      
      <motion.p
        className="text-lg font-medium text-gray-700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {getStateText()}
      </motion.p>
      
      {(isListening || isSpeaking) && (
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-8 ${getStateColor()} rounded-full`}
              animate={{
                height: [8, 24, 8],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceVisualizer;