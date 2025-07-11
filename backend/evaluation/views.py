import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Evaluation
from .serializers import EvaluationSerializer
from django.conf import settings

class EvaluationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EvaluationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            evaluation = serializer.save()
            try:
                ia_result = self.analyser_evaluation_ia_together(
                    request.user.profile.coaching_type,
                    evaluation.answers
                )
                evaluation.resultat_ia = ia_result
                evaluation.save()

                # Re-serialize après mise à jour pour inclure resultat_ia
                serializer = EvaluationSerializer(evaluation)

            except Exception as e:
                print("Erreur IA Together.ai:", e)
                # Optionnel : fallback message
                evaluation.resultat_ia = "L'analyse IA est temporairement indisponible."
                evaluation.save()
                serializer = EvaluationSerializer(evaluation)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def analyser_evaluation_ia_together(self, coaching_type, answers):
        prompt = f"Voici une évaluation pour un coaching '{coaching_type}'. Donne un plan structuré :\n"
        for i, a in enumerate(answers, 1):
            prompt += f"{i}. {a}\n"
        prompt += "\nRéponds avec un plan clair et motivant."

        url = "https://api.together.ai/v1/generate"
        headers = {
            "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "mistral-7b",
            "prompt": prompt,
            "max_tokens": 512,
            "temperature": 0.7,
            "stop": None,
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()

        if "text" in result:
            return result["text"]
        elif "generations" in result and len(result["generations"]) > 0:
            return result["generations"][0]["text"]
        else:
            raise ValueError("Réponse inattendue de Together.ai")
