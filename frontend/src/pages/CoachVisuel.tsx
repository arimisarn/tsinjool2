import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Eye, Play, Pause } from "lucide-react";

import { WebcamCapture } from "@/components/clients/WebcamCapture";
import { FaceDetection } from "@/components/clients/FaceDetection";
import { AICoach } from "@/components/clients/AICoach";
import { initializeFaceAPI } from "@/utils/faceDetection";
import { type EmotionData } from "../types/index";

function CoachVisuel() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<HTMLVideoElement | null>(
    null
  );
  const [currentEmotions, setCurrentEmotions] = useState<EmotionData | null>(
    null
  );
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isCoachActive, setIsCoachActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const success = await initializeFaceAPI();
        if (success) {
          setIsInitialized(true);
        } else {
          console.error("Échec du chargement des modèles face-api");
        }
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleVideoReady = (video: HTMLVideoElement) => {
    setCurrentVideo(video);
  };

  const handleEmotionDetected = (emotions: EmotionData) => {
    setCurrentEmotions(emotions);
  };

  const toggleWebcam = () => {
    setIsWebcamActive(!isWebcamActive);
    if (isWebcamActive) {
      setCurrentVideo(null);
      setCurrentEmotions(null);
    }
  };

  const toggleCoach = () => {
    setIsCoachActive(!isCoachActive);
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center dark:text-white text-gray-900"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">
            Initialisation de l'IA Coach
          </h2>
          <p className="dark:text-gray-300 text-gray-700">Chargement ...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white/80 dark:bg-zinc-900/90 border-b border-gray-300 dark:border-white/10 top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            {/* Logo / Titre */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <Brain
                className="text-purple-500 dark:text-purple-400"
                size={28}
              />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                SenseAI
              </h1>
            </motion.div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
              {/* Toggle Webcam */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWebcam}
                className={`w-full sm:w-auto px-4 py-2 rounded-full font-medium transition-all text-white flex items-center justify-center gap-2
                ${
                  isWebcamActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <Eye size={20} />
                <span>{isWebcamActive ? "Arrêter" : "Démarrer"}</span>
              </motion.button>

              {/* Toggle Coach */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCoach}
                disabled={!isWebcamActive}
                className={`w-full sm:w-auto px-4 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2
                ${
                  isCoachActive
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }
                ${
                  !isWebcamActive &&
                  "opacity-60 cursor-not-allowed dark:bg-zinc-700 bg-gray-400"
                }`}
              >
                {isCoachActive ? <Pause size={20} /> : <Play size={20} />}
                <span>Coach {isCoachActive ? "ON" : "OFF"}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Webcam Section */}
          <div className="lg:col-span-2 space-y-6">
            <WebcamCapture
              onVideoReady={handleVideoReady}
              isActive={isWebcamActive}
              onToggle={toggleWebcam}
            />

            <AnimatePresence>
              {isWebcamActive && currentVideo && (
                <FaceDetection
                  video={currentVideo}
                  onEmotionDetected={handleEmotionDetected}
                  isActive={isWebcamActive}
                />
              )}
            </AnimatePresence>
          </div>

          {/* AI Coach Section */}
          <div className="space-y-6">
            <AICoach emotions={currentEmotions} isActive={isCoachActive} />
          </div>
        </div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white/30 dark:bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-gray-300 dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isWebcamActive ? "bg-green-400" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm">
                  Webcam: {isWebcamActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCoachActive ? "bg-blue-400" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm">
                  Coach: {isCoachActive ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {currentEmotions
                ? "Émotions détectées"
                : "En attente de détection"}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default CoachVisuel;
