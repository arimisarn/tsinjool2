import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Square } from 'lucide-react';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  disabled = false
}) => {
  const handleClick = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const getButtonState = () => {
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  const getButtonContent = () => {
    switch (getButtonState()) {
      case 'speaking':
        return {
          icon: <Volume2 className="w-8 h-8" />,
          color: 'from-green-500 to-emerald-500',
          pulseColor: 'bg-green-500/20',
          text: 'IA en train de parler...'
        };
      case 'listening':
        return {
          icon: <Mic className="w-8 h-8" />,
          color: 'from-red-500 to-pink-500',
          pulseColor: 'bg-red-500/20',
          text: 'Écoute en cours...'
        };
      default:
        return {
          icon: <MicOff className="w-8 h-8" />,
          color: 'from-blue-500 to-purple-500',
          pulseColor: 'bg-blue-500/20',
          text: 'Cliquez pour parler'
        };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${buttonContent.color} 
          text-white shadow-lg hover:shadow-xl transform transition-all duration-200 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} 
          flex items-center justify-center`}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
      >
        {(isListening || isSpeaking) && (
          <motion.div
            className={`absolute inset-0 rounded-full ${buttonContent.pulseColor}`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        
        <motion.div
          animate={{
            rotate: isSpeaking ? 360 : 0,
          }}
          transition={{
            duration: 2,
            repeat: isSpeaking ? Infinity : 0,
            ease: "linear",
          }}
        >
          {buttonContent.icon}
        </motion.div>
        
        {isSpeaking && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onStopSpeaking();
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full 
              flex items-center justify-center text-white shadow-lg hover:bg-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Square className="w-4 h-4" />
          </motion.button>
        )}
      </motion.button>
      
      <motion.p
        className="text-sm text-gray-400 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 2,
          repeat: (isListening || isSpeaking) ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {buttonContent.text}
      </motion.p>
    </div>
  );
};