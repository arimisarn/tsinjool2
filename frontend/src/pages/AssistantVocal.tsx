import React, { useState, useRef } from 'react';
import axios from 'axios';

interface Conversation {
  id: number;
  user_message: string;
  ai_response: string;
  created_at: string;
}

const AssistantVocal: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/assistant/process-audio/`,
          { audio: base64Audio },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        setCurrentResponse(response.data.ai_response);
        
        // Synthèse vocale (gratuite dans le navigateur)
        const utterance = new SpeechSynthesisUtterance(response.data.ai_response);
        utterance.lang = 'fr-FR';
        speechSynthesis.speak(utterance);
        
        // Actualiser les conversations
        fetchConversations();
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Erreur traitement audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/assistant/conversations/`
      );
      setConversations(response.data);
    } catch (error) {
      console.error('Erreur récupération conversations:', error);
    }
  };

  React.useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="voice-assistant p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Assistant Vocal IA</h1>
      
      <div className="recording-section bg-gray-100 p-6 rounded-lg mb-6">
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full text-white font-bold text-lg ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecording ? '⏹️' : '🎤'}
          </button>
          
          <p className="mt-4 text-center">
            {isRecording 
              ? 'Enregistrement en cours... Cliquez pour arrêter' 
              : isProcessing 
                ? 'Traitement en cours...' 
                : 'Cliquez pour commencer à parler'
            }
          </p>
        </div>
      </div>

      {currentResponse && (
        <div className="current-response bg-green-100 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Réponse actuelle:</h3>
          <p>{currentResponse}</p>
        </div>
      )}

      <div className="conversations-history">
        <h2 className="text-xl font-bold mb-4">Historique des conversations</h2>
        {conversations.map((conv) => (
          <div key={conv.id} className="conversation bg-white p-4 rounded-lg mb-4 shadow">
            <div className="user-message mb-2">
              <strong>Vous:</strong> {conv.user_message}
            </div>
            <div className="ai-response">
              <strong>Assistant:</strong> {conv.ai_response}
            </div>
            <div className="timestamp text-sm text-gray-500 mt-2">
              {new Date(conv.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssistantVocal;