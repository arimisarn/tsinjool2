import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Settings, Wifi, WifiOff } from 'lucide-react';
import VoiceVisualizer from '@/components/clients/VoiceVisualizer';
import { sendToGroq, testGroqConnection } from "@/utils/groq";
import VoiceControls from "@/components/clients/VoiceControls";
import MessageHistory from "@/components/clients/MessageHistory";
import { SpeechRecognitionService, SpeechSynthesisService } from "@/utils/speech";
import { type Message, type AIState, type VoiceSettings } from "@/types";



function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiState, setAiState] = useState<AIState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isIdle: true,
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'fr-FR',
    voice: null,
    rate: 1,
    pitch: 1,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'working' | 'error'>('unknown');

  const speechRecognition = useRef<SpeechRecognitionService | null>(null);
  const speechSynthesis = useRef<SpeechSynthesisService | null>(null);

  useEffect(() => {
    speechRecognition.current = new SpeechRecognitionService();
    speechSynthesis.current = new SpeechSynthesisService();

    if (!speechRecognition.current.isRecognitionSupported()) {
      setError('Reconnaissance vocale non supportée par votre navigateur. Utilisez Chrome ou Edge.');
    }

    // Test de la connexion API au démarrage
    testGroqConnection().then(isWorking => {
      setApiStatus(isWorking ? 'working' : 'error');
    });

    // Écouter les changements de connexion
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.stop();
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleStartListening = () => {
    if (!speechRecognition.current) return;
    
    if (!isOnline) {
      setError('Pas de connexion internet. Vérifiez votre connexion.');
      return;
    }

    setError(null);
    setAiState({
      isListening: true,
      isProcessing: false,
      isSpeaking: false,
      isIdle: false,
    });

    speechRecognition.current.startListening(
      async (transcript) => {
        console.log('Transcript reçu:', transcript);
        
        setAiState({
          isListening: false,
          isProcessing: true,
          isSpeaking: false,
          isIdle: false,
        });

        addMessage(transcript, true);

        try {
          const aiResponse = await sendToGroq(transcript);
          
          setAiState({
            isListening: false,
            isProcessing: false,
            isSpeaking: true,
            isIdle: false,
          });

          addMessage(aiResponse, false);

          if (speechSynthesis.current) {
            await speechSynthesis.current.speak(aiResponse, voiceSettings);
          }
          
          setApiStatus('working');
        } catch (error) {
          console.error('Erreur IA:', error);
          setApiStatus('error');
          
          let errorMessage = 'Erreur lors de la communication avec l\'IA';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          setError(errorMessage);
          addMessage(`Erreur: ${errorMessage}`, false);
        }

        setAiState({
          isListening: false,
          isProcessing: false,
          isSpeaking: false,
          isIdle: true,
        });
      },
      (error) => {
        console.error('Erreur reconnaissance:', error);
        setError(error);
        setAiState({
          isListening: false,
          isProcessing: false,
          isSpeaking: false,
          isIdle: true,
        });
      }
    );
  };

  const handleStopListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stopListening();
    }
    setAiState({
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
      isIdle: true,
    });
  };

  const handleStopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.stop();
    }
    setAiState({
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
      isIdle: true,
    });
  };

  const clearHistory = () => {
    setMessages([]);
    setError(null);
  };

  const retryConnection = async () => {
    setError(null);
    const isWorking = await testGroqConnection();
    setApiStatus(isWorking ? 'working' : 'error');
    if (!isWorking) {
      setError('Impossible de se connecter à l\'API Groq. Vérifiez votre clé API.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="w-8 h-8 text-blue-600" />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900">
                Assistant IA Vocal
              </h1>
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <div className={`w-3 h-3 rounded-full ${
                  apiStatus === 'working' ? 'bg-green-500' : 
                  apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={retryConnection}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Test API
              </button>
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Status Banner */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 mx-4 mt-4 rounded-lg"
        >
          <p>Mode hors ligne - Reconnectez-vous à internet pour utiliser l'IA</p>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voice Interface */}
          <div className="flex flex-col items-center justify-center space-y-8 bg-white rounded-2xl shadow-lg p-8">
            <VoiceVisualizer
              isListening={aiState.isListening}
              isProcessing={aiState.isProcessing}
              isSpeaking={aiState.isSpeaking}
            />
            
            <VoiceControls
              isListening={aiState.isListening}
              isProcessing={aiState.isProcessing}
              isSpeaking={aiState.isSpeaking}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              onStopSpeaking={handleStopSpeaking}
            />

            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Cliquez sur "Parler" et commencez à parler à votre IA
              </p>
              <p className="text-sm text-gray-500">
                L'IA vous comprend et vous répond vocalement
              </p>
              {!isOnline && (
                <p className="text-sm text-red-500 mt-2">
                  ⚠️ Connexion internet requise
                </p>
              )}
            </div>
          </div>

          {/* Message History */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <MessageHistory messages={messages} />
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Paramètres Vocaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select
                  value={voiceSettings.language}
                  onChange={(e) => setVoiceSettings(prev => ({ 
                    ...prev, 
                    language: e.target.value as 'fr-FR' | 'en-US' 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fr-FR">Français</option>
                  <option value="en-US">Anglais</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vitesse: {voiceSettings.rate}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.rate}
                  onChange={(e) => setVoiceSettings(prev => ({ 
                    ...prev, 
                    rate: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">État du système</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Connexion internet:</span>
                  <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                    {isOnline ? 'Connecté' : 'Déconnecté'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Groq:</span>
                  <span className={
                    apiStatus === 'working' ? 'text-green-600' : 
                    apiStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                  }>
                    {apiStatus === 'working' ? 'Fonctionnel' : 
                     apiStatus === 'error' ? 'Erreur' : 'Test en cours...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reconnaissance vocale:</span>
                  <span className={speechRecognition.current?.isRecognitionSupported() ? 'text-green-600' : 'text-red-600'}>
                    {speechRecognition.current?.isRecognitionSupported() ? 'Supportée' : 'Non supportée'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>Assistant IA Vocal propulsé par Groq API</p>
            <p className="text-sm mt-2">
              Parlez naturellement et l'IA vous répondra vocalement
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;