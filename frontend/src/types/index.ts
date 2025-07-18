export interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EmotionData {
  angry: number;
  disgusted: number;
  fearful: number;
  happy: number;
  neutral: number;
  sad: number;
  surprised: number;
}

export interface CoachingSession {
  id: string;
  timestamp: Date;
  dominantEmotion: string;
  emotionScore: number;
  advice: string;
  duration: number;
}

export interface AICoachResponse {
  advice: string;
  tone: "encouraging" | "supportive" | "motivational" | "calming";
  priority: "high" | "medium" | "low";
}

export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
}
