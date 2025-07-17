from .models import Notification
import openai
from django.conf import settings
import requests

openai.api_key = settings.OPENAI_API_KEY
PEXELS_API_KEY = settings.PEXELS_API_KEY


def analyser_evaluation_ia(coaching_type: str, answers: list[str]) -> str:
    prompt = f"Voici une évaluation pour un coaching '{coaching_type}'. Donne un plan structuré :\n"
    for i, a in enumerate(answers, 1):
        prompt += f"{i}. {a}\n"
    prompt += "\nRéponds avec un plan clair et motivant."

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es un coach expert."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=600,
    )
    return response.choices[0].message.content.strip()


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

from django.contrib.auth import get_user_model

User = get_user_model()

def send_notification(user: User, message: str, notif_type: str = "info"):
    Notification.objects.create(
        user=user,
        message=message,
        type=notif_type
    )