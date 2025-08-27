import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Volume2, VolumeX, Settings } from "lucide-react";
import { useGroqAI } from "@/hooks/useGroqAI";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import type { EmotionData, CoachingSession } from "@/types/index";

interface AICoachProps {
  emotions: EmotionData | null;
  isActive: boolean;
}

export const AICoach: React.FC<AICoachProps> = ({ emotions, isActive }) => {
  const { getCoachingAdvice, isLoading } = useGroqAI();
  const { speak, stop, isSpeaking, isSupported, settings, setSettings } =
    useSpeechSynthesis();
  const [currentAdvice, setCurrentAdvice] = useState<string | null>(null);
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  useEffect(() => {
    if (emotions && isActive) {
      handleNewEmotion(emotions);
    }
  }, [emotions, isActive]);

  const handleNewEmotion = async (emotionData: EmotionData) => {
    const advice = await getCoachingAdvice(emotionData);
    if (advice) {
      setCurrentAdvice(advice.advice);


      const session: CoachingSession = {
        id: Date.now().toString(),
        timestamp: new Date(),
        dominantEmotion: Object.entries(emotionData).reduce((a, b) =>
          emotionData[a[0] as keyof EmotionData] >
          emotionData[b[0] as keyof EmotionData]
            ? a
            : b
        )[0],
        emotionScore: Math.max(...Object.values(emotionData)),
        advice: advice.advice,
        duration: 0,
      };

      setSessions((prev) => [session, ...prev.slice(0, 9)]);


      if (autoSpeak && isSupported) {
        speak(advice.advice);
      }
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stop();
    } else if (currentAdvice) {
      speak(currentAdvice);
    }
  };

  return (
    <div className="space-y-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <MessageCircle size={24} />
            <span>Coach IA</span>
          </h3>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSpeaking}
              disabled={!isSupported}
              className={`p-2 rounded-full transition-all ${
                isSpeaking
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-all"
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </motion.div>
          )}

          {currentAdvice && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-lg p-4">
                <p className="text-white text-lg leading-relaxed">
                  {currentAdvice}
                </p>
              </div>

              {isSpeaking && (
                <div className="flex items-center space-x-2 text-green-400">
                  <Volume2 size={16} />
                  <span className="text-sm">Lecture en cours...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Paramètres */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/10 dark:bg-gray-800/50 rounded-2xl p-6 border border-white/20 shadow-inner"
          >
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Paramètres Audio
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-900 dark:text-gray-300 mb-2">
                  Lecture automatique
                </label>
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    autoSpeak ? "bg-green-500" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoSpeak ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-900 dark:text-gray-300 mb-2">
                  Vitesse: {settings.rate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.rate}
                  onChange={(e) =>
                    setSettings((prev: any) => ({
                      ...prev,
                      rate: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-900 dark:text-gray-300 mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) =>
                    setSettings((prev: any) => ({
                      ...prev,
                      volume: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historique */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 dark:bg-gray-800/40 rounded-2xl p-6 border border-white/20 shadow-md"
        >
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Historique</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 dark:bg-gray-700 rounded-lg p-3 border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {session.dominantEmotion}
                  </span>
                  <span className="text-xs text-gray-400">
                    {session.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white">{session.advice}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
