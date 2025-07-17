export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AIState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isIdle: boolean;
}

export interface VoiceSettings {
  language: 'fr-FR' | 'en-US';
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
}