interface AIResponse {
  response: string;
  error?: string;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || "";
    this.baseUrl = "https://api.groq.com/openai/v1/chat/completions";

    console.log("API Key configured:", this.apiKey ? "Yes" : "No");
  }

  async sendMessage(message: string): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        response:
          "Pour utiliser l'IA vocale, vous devez configurer une clé API Groq gratuite. Rendez-vous sur console.groq.com pour créer un compte et obtenir votre clé API.",
        error: "API_KEY_MISSING",
      };
    }

    console.log("Sending message to Groq API:", message);

    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant IA vocal français amical et utile. Réponds de manière naturelle et conversationnelle, comme dans une vraie conversation. Sois concis mais informatif.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      console.log("Groq API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error:", errorText);
        throw new Error(`Erreur API (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("Groq API response:", data);

      return {
        response:
          data.choices[0]?.message?.content ||
          "Désolé, je n'ai pas pu générer une réponse.",
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return {
        response:
          "Erreur réseau. Vérifiez votre connexion internet et votre clé API Groq.",
        error: error instanceof Error ? error.message : "NETWORK_ERROR",
      };
    }
  }
}

export const aiService = new AIService();
