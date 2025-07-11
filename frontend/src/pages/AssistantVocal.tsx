"use client";
import { useState } from "react";

export default function AssistantVocal() {
  const [reply, setReply] = useState("");
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  console.log(mediaRecorder);
  

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const res = await fetch("https://tsinjool-backend.onrender.com/api/voice-chat/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setReply(data.reply);

      // 🔊 Lecture de la réponse en vocal
      const utterance = new SpeechSynthesisUtterance(data.reply);
      utterance.lang = "fr-FR";
      speechSynthesis.speak(utterance);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);

    // Stop après 5 secondes
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
    }, 5000);
  };

  return (
    <div className="p-4 text-center">
      <button
        onClick={startRecording}
        disabled={recording}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        🎤 {recording ? "Enregistrement..." : "Parler"}
      </button>
      {reply && (
        <p className="mt-4 text-lg font-semibold text-gray-800">🤖 {reply}</p>
      )}
    </div>
  );
}
