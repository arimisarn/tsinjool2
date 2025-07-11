import React, { useRef, useState } from "react";

const AssistantVocal: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [responseAudioUrl, setResponseAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.webm");

      const response = await fetch("https://ton-backend.com/api/voice-chat/", {
        method: "POST",
        body: formData,
      });

      // Lire le contenu audio de la réponse
      const responseBlob = await response.blob();
      const audioUrl = URL.createObjectURL(responseBlob);
      setResponseAudioUrl(audioUrl);

      // Extraire la transcription et le texte depuis les headers (à adapter selon ton backend)
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result as string);
          setTranscription(json.transcription || "");
          setResponseText(json.response_text || "");
        } catch (e) {
          console.warn("Impossible d'analyser la réponse JSON.");
        }
      };
      reader.readAsText(responseBlob);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "🛑 Stop" : "🎙️ Talk to AI"}
      </button>

      {transcription && (
        <p><strong>🗣️ Toi :</strong> {transcription}</p>
      )}
      {responseText && (
        <p><strong>🤖 IA :</strong> {responseText}</p>
      )}
      {responseAudioUrl && (
        <audio src={responseAudioUrl} controls autoPlay />
      )}
    </div>
  );
};

export default AssistantVocal;
