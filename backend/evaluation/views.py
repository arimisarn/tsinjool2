from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Evaluation
from .serializers import EvaluationSerializer
from .utils import analyser_evaluation_ia

class EvaluationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EvaluationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            evaluation = serializer.save()
            try:
                ia_result = analyser_evaluation_ia(
                    request.user.profile.coaching_type,
                    evaluation.answers
                )
                evaluation.resultat_ia = ia_result
                evaluation.save()
            except Exception as e:
                print("Erreur IA:", e)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_evaluation(request):
    try:
        last = Evaluation.objects.filter(user=request.user).latest('created_at')
        serializer = EvaluationSerializer(last)
        return Response(serializer.data)
    except Evaluation.DoesNotExist:
        return Response({"detail": "Aucune évaluation trouvée."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_evaluation(request):
    try:
        last = Evaluation.objects.filter(user=request.user).latest('created_at')
        serializer = EvaluationSerializer(last)
        return Response(serializer.data)
    except Evaluation.DoesNotExist:
        return Response({"detail": "Aucune évaluation trouvée."}, status=status.HTTP_404_NOT_FOUND)