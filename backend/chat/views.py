import os
import requests
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Conversation, Message

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def chat_with_ai(request):
    user = request.user
    prompt = request.data.get("prompt")
    conversation_id = request.data.get("conversation_id")

    if not prompt:
        return Response({"error": "Le message est vide"}, status=status.HTTP_400_BAD_REQUEST)

    # Récupère ou crée la conversation
    if conversation_id:
        try:
            conversation = Conversation.objects.get(id=conversation_id, user=user)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    else:
        conversation = Conversation.objects.create(
            user=user,
            title=prompt[:40]  # Titre par défaut basé sur le début du message
        )

    # Sauvegarde le message utilisateur
    Message.objects.create(
        conversation=conversation,
        sender="user",
        content=prompt
    )

    # Prépare l’appel API Together.ai
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        "prompt": f"[INST] {prompt} [/INST]",
        "max_tokens": 200,
        "temperature": 0.7,
    }

    try:
        res = requests.post("https://api.together.xyz/v1/completions", json=payload, headers=headers)
        res.raise_for_status()
        response_data = res.json()
        ai_message = response_data["choices"][0]["text"]

        # Sauvegarde la réponse IA
        Message.objects.create(
            conversation=conversation,
            sender="ai",
            content=ai_message
        )

        return Response({
            "conversation_id": conversation.id,
            "response": ai_message
        })

    except requests.RequestException as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def conversation_list(request):
    user = request.user
    conversations = Conversation.objects.filter(user=user).order_by('-created_at')
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def conversation_messages(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id, user=request.user)
    except Conversation.DoesNotExist:
        return Response({"detail": "Conversation introuvable."}, status=status.HTTP_404_NOT_FOUND)

    messages = Message.objects.filter(conversation=conversation).order_by("timestamp")
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)