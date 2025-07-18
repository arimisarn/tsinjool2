import { useState, useEffect, useCallback } from "react";
import {type SpeechSettings } from "../types/index";

export const useSpeechSynthesis = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<SpeechSettings>({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Préférer une voix française
        const frenchVoice = availableVoices.find(
          (voice) =>
            voice.lang.startsWith("fr") || voice.name.includes("French")
        );

        if (frenchVoice && !settings.voice) {
          setSettings((prev) => ({ ...prev, voice: frenchVoice.name }));
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [settings.voice]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;

      // Arrêter toute synthèse en cours
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Appliquer les paramètres
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;

      // Sélectionner la voix
      if (settings.voice) {
        const selectedVoice = voices.find(
          (voice) => voice.name === settings.voice
        );
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Événements
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, settings, voices]
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    voices,
    settings,
    setSettings,
    speak,
    stop,
  };
};
