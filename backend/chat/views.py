import os
import requests
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Conversation, Message
from rest_framework import status


TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

# GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # 🔐 Appelle la clé depuis l'environnement

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
            "[INST] Tu es Tsinjo, une IA amicale et bienveillante qui aide l'utilisateur. Tu es très gentil et très intelligent, très sympa, tu utilise toujours des émojis. Et tu parles français.\n\n"
            f"Utilisateur: {prompt}\n\nTsinjo:"
            " [/INST]"
        ),
        "max_tokens": 512,
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



# class VoiceChatView(APIView):
#     parser_classes = [MultiPartParser]

#     def post(self, request, *args, **kwargs):
#         audio_file = request.FILES.get("audio")
#         if not audio_file:
#             return Response({"error": "Aucun fichier audio reçu."}, status=400)

#         # ⏺️ Sauver le fichier temporairement
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp_audio:
#             for chunk in audio_file.chunks():
#                 tmp_audio.write(chunk)
#             audio_path = tmp_audio.name

#         # 🧠 Transcription avec Whisper
#         transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-large")
#         transcription = transcriber(audio_path)["text"]

#         # 🤖 Génération de réponse avec Mistral
#         chat = pipeline("text-generation", model="mistralai/Mistral-7B-Instruct-v0.1")
#         response_text = chat(f"L'utilisateur a dit : {transcription}")[0]["generated_text"]

#         # 🔊 Synthèse vocale avec TTS
#         tts = TTS(model_name="tts_models/fr/thorsten/tacotron2-DCA")  # adapte selon la langue !
#         response_audio_path = os.path.join(tempfile.gettempdir(), "response.wav")
#         tts.tts_to_file(text=response_text, file_path=response_audio_path)

#         # 📤 Envoie l'audio de réponse au frontend
#         with open(response_audio_path, "rb") as audio_response:
#             return Response(
#                 {
#                     "transcription": transcription,
#                     "response_text": response_text
#                 },
#                 headers={"Content-Disposition": "attachment; filename=response.wav"},
#                 content_type="audio/wav",
#             )

#     parser_classes = [MultiPartParser]

#     def post(self, request, *args, **kwargs):
#         audio_file = request.FILES.get("audio")

#         if not audio_file:
#             return Response({"error": "Aucun fichier audio reçu."}, status=400)

#         with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
#             for chunk in audio_file.chunks():
#                 tmp.write(chunk)
#             tmp_path = tmp.name

#         # 🧠 Transcription avec Hugging Face
#         transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-large")
#         transcription = transcriber(tmp_path)["text"]

#         return Response({"transcription": transcription})



# @api_view(['POST'])
# def process_audio(request):
#     try:
#         # Récupération de l'audio depuis le frontend
#         audio_data = request.data.get('audio')
#         if not audio_data:
#             return Response({'error': 'No audio data'}, status=400)
        
#         # Conversion base64 vers audio
#         audio_bytes = base64.b64decode(audio_data.split(',')[1])
        
#         # Conversion en WAV pour speech recognition
#         audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
#         wav_buffer = io.BytesIO()
#         audio.export(wav_buffer, format="wav")
#         wav_buffer.seek(0)
        
#         # Reconnaissance vocale avec SpeechRecognition (gratuit)
#         recognizer = sr.Recognizer()
#         with sr.AudioFile(wav_buffer) as source:
#             audio_data = recognizer.record(source)
#             text = recognizer.recognize_google(audio_data, language='fr-FR')
        
#         # Traitement avec OpenAI (crédits gratuits)
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[
#                 {"role": "system", "content": "Tu es un assistant vocal serviable en français."},
#                 {"role": "user", "content": text}
#             ],
#             max_tokens=150
#         )
        
#         ai_response = response.choices[0].message.content
        
#         # Sauvegarde en base
#         conversation = ConversationVoice.objects.create(
#             user_message=text,
#             ai_response=ai_response
#         )
        
#         return Response({
#             'user_message': text,
#             'ai_response': ai_response,
#             'conversation_id': conversation.id
#         })
        
#     except Exception as e:
#         return Response({'error': str(e)}, status=500)

# @api_view(['GET'])
# def get_conversations(request):
#     conversations = ConversationVoice.objects.all()[:10]
#     data = [{
#         'id': conv.id,
#         'user_message': conv.user_message,
#         'ai_response': conv.ai_response,
#         'created_at': conv.created_at
#     } for conv in conversations]
#     return Response(data)