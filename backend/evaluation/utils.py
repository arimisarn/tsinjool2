import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

def analyser_evaluation_ia(coaching_type: str, answers: list[str]) -> str:
    prompt = f"Voici une évaluation pour un coaching '{coaching_type}'. Donne un plan structuré :\n"
    for i, a in enumerate(answers, 1):
        prompt += f"{i}. {a}\n"
    prompt += "\nRéponds avec un plan clair et motivant."

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Tu es un coach expert."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=600
    )
    return response.choices[0].message.content.strip()
