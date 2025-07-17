import { type VoiceSettings } from "@/types";
export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configuration optimisée pour éviter les erreurs réseau
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'fr-FR';
      this.recognition.maxAlternatives = 1;
      
      // Paramètres pour améliorer la stabilité
      if ('webkitSpeechRecognition' in window) {
        (this.recognition as any).serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
      }
      
      this.isSupported = true;
    }
  }

  startListening(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.isSupported || !this.recognition) {
      onError('Reconnaissance vocale non supportée par votre navigateur');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    let finalTranscript = '';
    let hasResult = false;
    let timeoutId: NodeJS.Timeout;

    // Timeout de sécurité
    const startTimeout = () => {
      timeoutId = setTimeout(() => {
        if (!hasResult) {
          this.stopListening();
          onError('Timeout - Aucun son détecté. Réessayez.');
        }
      }, 10000); // 10 secondes
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      startTimeout();
    };

    this.recognition.onresult = (event) => {
      clearTimeout(timeoutId);
      hasResult = true;
      
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Si on a un résultat final, on l'utilise
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
        this.isListening = false;
      }
    };

    this.recognition.onerror = (event) => {
      clearTimeout(timeoutId);
      this.isListening = false;
      
      let errorMessage = 'Erreur de reconnaissance vocale';
      
      switch (event.error) {
        case 'network':
          errorMessage = 'Erreur réseau. Vérifiez votre connexion internet et réessayez.';
          break;
        case 'not-allowed':
          errorMessage = 'Accès au microphone refusé. Autorisez l\'accès au microphone.';
          break;
        case 'no-speech':
          errorMessage = 'Aucun son détecté. Parlez plus fort ou rapprochez-vous du microphone.';
          break;
        case 'audio-capture':
          errorMessage = 'Erreur de capture audio. Vérifiez votre microphone.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Service de reconnaissance vocale non autorisé.';
          break;
        case 'bad-grammar':
          errorMessage = 'Erreur de grammaire dans la reconnaissance.';
          break;
        case 'language-not-supported':
          errorMessage = 'Langue non supportée.';
          break;
        default:
          errorMessage = `Erreur: ${event.error}`;
      }
      
      onError(errorMessage);
    };

    this.recognition.onend = () => {
      clearTimeout(timeoutId);
      this.isListening = false;
      
      // Si on a un résultat final, on ne fait rien
      // Sinon, on peut redémarrer automatiquement ou signaler une erreur
      if (!hasResult && finalTranscript.trim()) {
        onResult(finalTranscript.trim());
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      onError('Impossible de démarrer la reconnaissance vocale');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.warn('Erreur lors de l\'arrêt de la reconnaissance:', error);
      }
      this.isListening = false;
    }
  }

  isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

export class SpeechSynthesisService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    const loadVoicesImpl = () => {
      this.voices = this.synth.getVoices();
    };

    loadVoicesImpl();
    
    if (this.voices.length === 0) {
      this.synth.addEventListener('voiceschanged', loadVoicesImpl);
    }
  }

  speak(text: string, settings: VoiceSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      // Arrêter toute synthèse en cours
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      utterance.lang = settings.language;
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = 1;

      // Sélection de la voix
      if (settings.voice) {
        utterance.voice = settings.voice;
      } else {
        // Chercher une voix française de qualité
        const preferredVoices = this.voices.filter(voice => 
          voice.lang.startsWith('fr') && 
          (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.localService)
        );
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
        }
      }

      utterance.onstart = () => {
        console.log('Synthèse vocale démarrée');
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        console.error('Erreur synthèse vocale:', event.error);
        reject(new Error(`Erreur synthèse vocale: ${event.error}`));
      };

      try {
        this.synth.speak(utterance);
      } catch (error) {
        this.currentUtterance = null;
        reject(error);
      }
    });
  }

  stop() {
    if (this.currentUtterance) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  isSpeaking(): boolean {
    return this.synth.speaking;
  }
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}