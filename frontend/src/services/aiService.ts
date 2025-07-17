interface AIResponse {
  response: string;
  error?: string;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  async sendMessage(message: string): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        response: 'Erreur: Clé API Groq non configurée. Veuillez ajouter VITE_GROQ_API_KEY dans votre fichier .env',
        error: 'API_KEY_MISSING'
      };
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Tu es un assistant IA vocal français amical et utile. Réponds de manière naturelle et conversationnelle, comme dans une vraie conversation. Sois concis mais informatif.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        response: data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.'
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        response: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer.',
        error: 'NETWORK_ERROR'
      };
    }
  }
}

export const aiService = new AIService();