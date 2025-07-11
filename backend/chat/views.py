import os
import requests
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Conversation, Message
from django.conf import settings

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # 🔐 Appelle la clé depuis l'environnement

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
        # "prompt": f"[INST] {prompt} [/INST]",
        "prompt": (
            "[INST] Tu es Tsinjo, une IA amicale et bienveillante qui aide l'utilisateur. Et tu parles français.\n\n"
            f"Utilisateur: {prompt}\n\nTsinjo:"
            " [/INST]"
        ),
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



@api_view(['POST'])
def voice_chat(request):
    try:
        user_message = request.data.get("message", "").strip()
        if not user_message:
            return Response({"reply": "Je n'ai rien reçu. Réessaie."}, status=400)

        print("✅ Message reçu:", user_message)

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("❌ Clé API manquante")
            return Response({"reply": "Clé API manquante"}, status=500)

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "mixtral-8x7b-32768",  # ✅ Modèle recommandé par Groq (ou mixtral-8x7b-32768)
            "messages": [{"role": "user", "content": user_message}],
            "max_tokens": 200,
            "temperature": 0.7,
        }

        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        print("🌐 Groq response status:", response.status_code)
        print("🌐 Groq response body:", response.text)

        response.raise_for_status()
        data = response.json()
        reply = data["choices"][0]["message"]["content"]

        return Response({"reply": reply})

    except Exception as e:
        print("❌ Exception attrapée:", str(e))
        return Response({"reply": "Erreur serveur Groq.", "error": str(e)}, status=500)