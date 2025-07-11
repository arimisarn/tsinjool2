"use client";
import { useState } from "react";

export default function AssistantVocal() {
  const [reply, setReply] = useState("");
  const [recording, setRecording] = useState(false);

  const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Reconnaissance vocale non supportée par ce navigateur.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecording(true);
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setRecording(false);

      // Envoi au backend
      const res = await fetch("https://tsinjool-backend.onrender.com/api/voice-chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      });
      const data = await res.json();
      setReply(data.reply);

      // Lecture vocale de la réponse
      const utterance = new SpeechSynthesisUtterance(data.reply);
      utterance.lang = "fr-FR";
      speechSynthesis.speak(utterance);
    };

    recognition.start();
  };

  return (
    <div className="p-4 text-center">
      <button
        onClick={startRecognition}
        disabled={recording}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        🎤 {recording ? "Écoute..." : "Parler"}
      </button>
      {reply && <p className="mt-4 text-lg font-semibold text-gray-800">🤖 {reply}</p>}
    </div>
  );
}
