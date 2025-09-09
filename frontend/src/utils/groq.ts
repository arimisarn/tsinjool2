const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function sendToGroq(message: string): Promise<string> {
  if (!message.trim()) {
    throw new Error('Message vide');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes timeout

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Tu es Mirana (ne prononce pas Miranà mais on n apuie pas le"a" à la fin), un assistant IA vocal intelligent et amical conçu par Arimissa Nathalie. Réponds de manière naturelle et conversationnelle en français. Garde tes réponses concises mais informatives (maximum 100 mots). Sois chaleureux et engageant.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        stream: false
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Clé API Groq invalide. Vérifiez votre configuration.');
      } else if (response.status === 429) {
        throw new Error('Limite de requêtes atteinte. Attendez un moment.');
      } else if (response.status >= 500) {
        throw new Error('Erreur serveur Groq. Réessayez plus tard.');
      } else {
        throw new Error(`Erreur API Groq: ${response.status}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse API invalide');
    }

    const aiResponse = data.choices[0].message.content;
    
    if (!aiResponse || aiResponse.trim() === '') {
      throw new Error('Réponse vide de l\'IA');
    }

    return aiResponse.trim();
    
  } catch (error) {
    console.error('Erreur Groq API:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout - La requête a pris trop de temps');
      }
      throw error;
    }
    
    throw new Error('Erreur de communication avec l\'IA');
  }
}

// Fonction pour tester la connexion API
export async function testGroqConnection(): Promise<boolean> {
  try {
    const response = await sendToGroq('Test de connexion');
    return response.length > 0;
  } catch (error) {
    console.error('Test de connexion échoué:', error);
    return false;
  }
}