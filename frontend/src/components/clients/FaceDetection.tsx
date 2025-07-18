import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  detectFaceAndEmotion,
  getDominantEmotion,
  getEmotionColor,
  getEmotionEmoji,
} from "../../utils/faceDetection";

import type {
  FaceDetection as FaceDetectionType,
  EmotionData,
} from "../../types/index";

interface FaceDetectionProps {
  video: HTMLVideoElement | null;
  onEmotionDetected: (emotions: EmotionData) => void;
  isActive: boolean;
}

export const FaceDetection: React.FC<FaceDetectionProps> = ({
  video,
  onEmotionDetected,
  isActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionScore, setEmotionScore] = useState<number>(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentFace, setCurrentFace] = useState<FaceDetectionType | null>(
    null
  );
  console.log(currentFace);

  useEffect(() => {
    if (!video || !isActive) return;

    const interval = setInterval(async () => {
      if (canvasRef.current) {
        setIsDetecting(true);

        const { face, emotions } = await detectFaceAndEmotion(
          video,
          canvasRef.current
        );

        setCurrentFace(face); // utilise le type ici

        if (emotions) {
          const { emotion, score } = getDominantEmotion(emotions);
          setCurrentEmotion(emotion);
          setEmotionScore(score);
          onEmotionDetected(emotions);
        }

        setIsDetecting(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [video, isActive, onEmotionDetected]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Détection Faciale</h3>
        <motion.div
          animate={{ scale: isDetecting ? 1.1 : 1 }}
          className={`w-3 h-3 rounded-full ${
            isDetecting ? "bg-green-400" : "bg-gray-400"
          }`}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full h-32 bg-transparent"
        style={{ display: "none" }}
      />

      <AnimatePresence mode="wait">
        {currentEmotion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: getEmotionColor(currentEmotion) }}
              >
                {getEmotionEmoji(currentEmotion)}
              </div>
              <div>
                <h4 className="font-medium text-white capitalize">
                  {currentEmotion}
                </h4>
                <p className="text-sm text-gray-300">
                  Confiance: {Math.round(emotionScore * 100)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${emotionScore * 100}%` }}
                className="h-2 rounded-full"
                style={{ backgroundColor: getEmotionColor(currentEmotion) }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentEmotion && isActive && (
        <div className="text-center py-8 text-gray-400">
          <p>Recherche de visage...</p>
        </div>
      )}
    </motion.div>
  );
};
