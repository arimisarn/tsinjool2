"use client";

import { useState, useRef } from "react";

export default function AssistantVocal() {
  const [recording, setRecording] = useState(false);
  const [reply, setReply] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setReply("");
    setAudioSrc(null);
    chunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      try {
        const res = await fetch("https://tsinjool-backend.onrender.com/api/voice-chat/", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          setReply("Erreur serveur : " + res.statusText);
          return;
        }

        const data = await res.json();
        setReply(data.reply);

        if (data.audio_base64 && data.audio_format) {
          const src = `data:audio/${data.audio_format};base64,${data.audio_base64}`;
          setAudioSrc(src);
        }
      } catch (error) {
        setReply("Erreur réseau ou serveur.");
      }
    };

    mediaRecorder.start();
    setRecording(true);
    mediaRecorderRef.current = mediaRecorder;

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
      stream.getTracks().forEach((track) => track.stop());
    }, 5000);
  };

  return (
    <div className="p-4 text-center max-w-md mx-auto">
      <button
        className={`px-6 py-2 rounded-lg text-white ${
          recording ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
        onClick={startRecording}
        disabled={recording}
      >
        {recording ? "Enregistrement..." : "Parlez"}
      </button>

      {reply && <p className="mt-4 text-lg font-semibold text-gray-800">🤖 {reply}</p>}

      {audioSrc && (
        <audio
          src={audioSrc}
          controls
          autoPlay
          className="mt-4 mx-auto"
        />
      )}
    </div>
  );
}
