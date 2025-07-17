import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  isSpeaking: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isProcessing,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  isSpeaking,
}) => {
  return (
    <div className="flex space-x-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isListening ? onStopListening : onStartListening}
        disabled={isProcessing}
        className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-colors ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        <span>
          {isListening ? 'Arrêter' : 'Parler'}
        </span>
      </motion.button>

      {isSpeaking && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStopSpeaking}
          className="flex items-center space-x-2 px-6 py-3 rounded-full font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors"
        >
          <VolumeX size={20} />
          <span>Stop</span>
        </motion.button>
      )}
    </div>
  );
};

export default VoiceControls;