import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Evaluation
from .serializers import EvaluationSerializer
from django.conf import settings
MISTRAL_API_KEY = os.environ.get("MISTRAL_API_KEY")

class EvaluationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EvaluationSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            evaluation = serializer.save()

            try:
                coaching_type = request.user.profile.coaching_type
                answers = evaluation.answers

                # DEBUG LOG
                print("🔍 coaching_type:", coaching_type)
                print("🔍 answers:", answers)
                print("🔍 type answers:", type(answers))
                print("🔍 MISTRAL_API_KEY loaded:", bool(MISTRAL_API_KEY))

                ia_result = self.analyser_evaluation_ia_together(coaching_type, answers)
                evaluation.resultat_ia = ia_result
                evaluation.save()

                serializer = EvaluationSerializer(evaluation)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                print("❌ Erreur IA Together.ai:", str(e))
                evaluation.resultat_ia = "L'analyse IA est temporairement indisponible."
                evaluation.save()
                serializer = EvaluationSerializer(evaluation)
                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def analyser_evaluation_ia_together(self, coaching_type, answers):
        prompt = f"Voici une évaluation pour un coaching '{coaching_type}'. Donne un plan structuré :\n"
        for i, a in enumerate(answers, 1):
            prompt += f"{i}. {a}\n"
        prompt += "\nRéponds avec un plan clair et motivant."

        print("📤 Prompt envoyé à l'IA :")
        print(prompt)

        url = "https://api.together.xyz/v1/completions"
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "prompt": prompt,
            "max_tokens": 200,
            "temperature": 0.7,
        }

        response = requests.post(url, headers=headers, json=data)

        # Log de la réponse brute
        print("📥 Status code Together:", response.status_code)
        print("📥 Réponse texte:", response.text)

        response.raise_for_status()
        result = response.json()

        # Gestion flexible des formats de réponse
        if "text" in result:
            return result["text"]
        elif "generations" in result and len(result["generations"]) > 0:
            return result["generations"][0].get("text", "").strip()
        else:
            raise ValueError("Réponse inattendue de l'API Together.ai.")
