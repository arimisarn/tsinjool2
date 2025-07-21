import requests
import json
from django.conf import settings
from typing import Dict, List, Any
import re


class AICoachingService:
    """Service pour l'intégration avec Groq API (Mixtral)"""

    BASE_URL = "https://api.groq.com/openai/v1/chat/completions"

    @classmethod
    def generate_coaching_path(cls, evaluation_data: Dict[str, Any]) -> List[Dict]:
        prompt = cls._build_coaching_prompt(evaluation_data)

        try:
            response = requests.post(
                cls.BASE_URL,
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama3-70b-8192",
                    "messages": [
                        {
                            "role": "system",
                            "content": "Tu es un coach professionnel expérimenté. Tu crées des parcours de coaching personnalisés basés sur les évaluations des clients.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4096,
                },
            )

            if response.status_code == 200:
                ai_response = response.json()
                content = ai_response["choices"][0]["message"]["content"]
                print("🧠 Réponse brute de l’IA (non parsée) :\n", content)

                return cls._parse_coaching_response(
                    content, evaluation_data["coaching_type"]
                )
            else:
                print(f"❌ Erreur API Groq: {response.status_code} - {response.text}")
                return cls._get_default_coaching_path(evaluation_data["coaching_type"])

        except Exception as e:
            print(f"❌ Erreur lors de l'appel à Groq: {str(e)}")
            return cls._get_default_coaching_path(evaluation_data["coaching_type"])

    @classmethod
    def _build_coaching_prompt(cls, evaluation_data: Dict[str, Any]) -> str:
        coaching_type = evaluation_data["coaching_type"]
        answers = evaluation_data["answers"]

        answers_text = "\n".join([f"Question {k} : {v}" for k, v in answers.items()])

        label = {
            "life": "coaching de vie",
            "career": "coaching de carrière",
            "health": "coaching santé",
        }.get(coaching_type, coaching_type)

        return f"""
Tu es un coach professionnel expérimenté. Crée un parcours de coaching personnalisé en {label}, basé sur les réponses suivantes du client :

{answers_text}

Génère exactement 4 étapes progressives (ni plus, ni moins). Chaque étape doit avoir :
- un titre
- une description
- exactement 3 exercices

Chaque exercice contient :
- un titre engageant
- une description (1 phrase)
- une durée (entre 5 et 30 minutes)
- un type parmi : meditation, reflection, practice, breathing, visualization
- 3 instructions claires
- un emoji de personnage pour l'animation
- 3 conseils personnalisés du coach IA (champ : coach_tips une phrase courte)
- 2 vidéos ou ressources recommandées à rechercher sur youtube

⚠️ Réponds UNIQUEMENT avec un JSON **strictement valide**, **sans texte explicatif** ni commentaire, en respectant **exactement** cette structure :

{{
  "steps": [
    {{
      "title": "Titre de l'étape",
      "description": "Description de l'étape",
      "exercises": [
        {{
          "title": "Titre de l'exercice",
          "description": "Courte description",
          "duration": 15,
          "type": "meditation",
          "instructions": [
            "Instruction 1",
            "Instruction 2",
            "Instruction 3"
          ],
          "animation_character": "🧘‍♀️",
          "recommended_videos": [
            "Titre vidéo 1",
            "Titre vidéo 2"
          ],
          "coach_tips": [
            "Conseil 1",
            "Conseil 2",
            "Conseil 3"
            ]
        }}
      ]
    }}
  ]
}}
Génère jusqu'à la fin, ne coupe pas les réponses, Tu DOIS générer exactement 4 étapes avec 3 exercices par étape.
"""

    @classmethod
    def _parse_coaching_response(cls, response: str, coaching_type: str) -> List[Dict]:
        try:
            json_match = re.search(r"\{.*\}", response, re.DOTALL)
            if not json_match:
                raise ValueError("Aucun objet JSON détecté dans la réponse")

            parsed = json.loads(json_match.group())

            if "steps" not in parsed or not isinstance(parsed["steps"], list):
                raise ValueError(
                    "Structure JSON invalide : 'steps' manquant ou incorrect"
                )

            steps = []
            for i, step_data in enumerate(parsed["steps"][:4]):
                step = {
                    "title": step_data.get("title", f"Étape {i+1}"),
                    "description": step_data.get("description", ""),
                    "order": i + 1,
                    "exercises": [],
                }

                for j, exercise_data in enumerate(step_data.get("exercises", [])[:3]):
                    exercise = {
                        "title": exercise_data.get("title", f"Exercice {j+1}"),
                        "description": exercise_data.get("description", ""),
                        "duration": min(max(exercise_data.get("duration", 15), 5), 30),
                        "type": exercise_data.get("type", "practice"),
                        "instructions": exercise_data.get("instructions", []),
                        "animation_character": exercise_data.get(
                            "animation_character", "🤖"
                        ),
                        "recommended_videos": exercise_data.get(
                            "recommended_videos", []
                        ),
                    }
                    step["exercises"].append(exercise)

                steps.append(step)

            return steps

        except Exception as e:
            print(f"[⚠️] Erreur parsing IA : {str(e)}")
            return []

    @staticmethod
    def _get_default_coaching_path(coaching_type: str) -> List[Dict]:
        return [
            {
                "title": "Étape 1 par défaut",
                "description": "Description par défaut",
                "order": 1,
                "exercises": [
                    {
                        "title": "Exercice par défaut",
                        "description": "Description par défaut",
                        "duration": 15,
                        "type": "practice",
                        "instructions": ["Suivez les instructions à l'écran"],
                        "animation_character": "🤖",
                        "recommended_videos": [],
                    }
                ],
            }
        ]


def get_youtube_url_from_title(title: str, api_key: str) -> str | None:
    """Recherche la première vidéo YouTube correspondant au titre"""
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": title,
        "type": "video",
        "maxResults": 1,
        "key": api_key,
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print(f"Erreur API YouTube: {response.status_code} - {response.text}")
        return None
    data = response.json()
    items = data.get("items", [])
    if not items:
        return None
    video_id = items[0]["id"]["videoId"]
    return f"https://www.youtube.com/watch?v={video_id}"


def get_image_url_from_pexels(query: str) -> str | None:
    """Recherche une image correspondant au titre via Pexels API"""
    url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": settings.PEXELS_API_KEY  # ➤ ajoute cette clé dans ton .env ou settings.py
    }
    params = {"query": query, "per_page": 1}

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        print(f"[❌] Erreur API Pexels : {response.status_code} - {response.text}")
        return None

    data = response.json()
    photos = data.get("photos", [])
    if not photos:
        return None

    # Retourne l'URL de l'image (taille moyenne)
    return photos[0]["src"]["medium"]


def get_image_from_pexels(query: str) -> str | None:
    """Retourne l'URL de la première image trouvée sur Pexels"""
    url = "https://api.pexels.com/v1/search"
    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": 1}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Erreur Pexels: {response.status_code} - {response.text}")
        return None

    data = response.json()
    photos = data.get("photos", [])
    if photos:
        return photos[0]["src"]["medium"]
    return None
