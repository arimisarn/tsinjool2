import { useState, useCallback } from "react";
import type { AICoachResponse, EmotionData } from "../types/index";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const useGroqAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoachingAdvice = useCallback(
    async (
      emotions: EmotionData,
      context: string = ""
    ): Promise<AICoachResponse | null> => {
      if (!GROQ_API_KEY) {
        // Mode simulation pour la démonstration
        return simulateAIResponse(emotions);
      }

      setIsLoading(true);
      setError(null);

      try {
        const dominantEmotion = Object.entries(emotions).reduce((a, b) =>
          emotions[a[0] as keyof EmotionData] >
          emotions[b[0] as keyof EmotionData]
            ? a
            : b
        );

        const prompt = `Tu es un coach de bien-être expert. Analyse cette émotion dominante: ${
          dominantEmotion[0]
        } (${Math.round(dominantEmotion[1] * 100)}%). 
      Contexte: ${context}
      Donne un conseil bref, bienveillant et actionnable en français (max 20 mots).`;

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama3-8b-8192",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
              max_tokens: 150,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur API Groq");
        }

        const data = await response.json();
        const advice = data.choices[0].message.content;

        return {
          advice,
          tone: getToneFromEmotion(dominantEmotion[0]),
          priority: dominantEmotion[1] > 0.7 ? "high" : "medium",
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        return simulateAIResponse(emotions);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { getCoachingAdvice, isLoading, error };
};

const simulateAIResponse = (emotions: EmotionData): AICoachResponse => {
  const dominantEmotion = Object.entries(emotions).reduce((a, b) =>
    emotions[a[0] as keyof EmotionData] > emotions[b[0] as keyof EmotionData]
      ? a
      : b
  );

  const responses = {
    happy:
      "Magnifique ! Votre sourire illumine tout. Continuez à cultiver cette joie positive.",
    sad: "Je sens une mélancolie. Respirez profondément et rappelez-vous que chaque émotion est temporaire.",
    angry:
      "Cette tension est visible. Essayez quelques respirations lentes pour retrouver votre calme.",
    surprised:
      "Quelle belle ouverture ! L'étonnement nourrit la curiosité et l'apprentissage.",
    fearful:
      "Courage, vous n'êtes pas seul. Concentrez-vous sur ce qui est à votre portée maintenant.",
    disgusted:
      "Cette expression révèle un inconfort. Identifiez ce qui vous dérange et agissez.",
    neutral:
      "Votre sérénité est apaisante. Profitez de cet équilibre pour vous recentrer.",
  };

  return {
    advice:
      responses[dominantEmotion[0] as keyof typeof responses] ||
      responses.neutral,
    tone: getToneFromEmotion(dominantEmotion[0]),
    priority: dominantEmotion[1] > 0.7 ? "high" : "medium",
  };
};

const getToneFromEmotion = (emotion: string): AICoachResponse["tone"] => {
  const toneMap: Record<string, AICoachResponse["tone"]> = {
    happy: "encouraging",
    sad: "supportive",
    angry: "calming",
    surprised: "encouraging",
    fearful: "supportive",
    disgusted: "calming",
    neutral: "motivational",
  };
  return toneMap[emotion] ?? "supportive"; // fallback si clé inconnue
};
