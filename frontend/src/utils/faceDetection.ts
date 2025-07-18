import type { FaceDetection, EmotionData } from "../types/index";

// @ts-ignore (face-api.js chargé par CDN)
const faceapi = window.faceapi;

const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

export const initializeFaceAPI = async (): Promise<boolean> => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    return true;
  } catch (error) {
    console.error("Erreur lors du chargement des modèles:", error);
    return false;
  }
};

export const detectFaceAndEmotion = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): Promise<{ face: FaceDetection | null; emotions: EmotionData | null }> => {
  try {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length > 0) {
      const detection = detections[0];
      const { x, y, width, height } = detection.detection.box;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#8B5CF6";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      }

      return {
        face: { x, y, width, height },
        emotions: detection.expressions as EmotionData,
      };
    }

    return { face: null, emotions: null };
  } catch (error) {
    console.error("Erreur de détection:", error);
    return { face: null, emotions: null };
  }
};

export const getDominantEmotion = (
  emotions: EmotionData
): { emotion: string; score: number } => {
  const entries = Object.entries(emotions);
  const dominant = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
  return { emotion: dominant[0], score: dominant[1] };
};

export const getEmotionColor = (emotion: string): string => {
  const colors = {
    happy: "#10B981",
    sad: "#6366F1",
    angry: "#EF4444",
    surprised: "#F59E0B",
    fearful: "#8B5CF6",
    disgusted: "#84CC16",
    neutral: "#6B7280",
  };
  return colors[emotion as keyof typeof colors] || colors.neutral;
};

export const getEmotionEmoji = (emotion: string): string => {
  const emojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    fearful: "😨",
    disgusted: "🤢",
    neutral: "😐",
  };
  return emojis[emotion as keyof typeof emojis] || emojis.neutral;
};
