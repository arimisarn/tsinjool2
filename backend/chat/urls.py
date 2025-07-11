from django.urls import include, path
from .views import chat_with_ai,conversation_list, conversation_messages

urlpatterns = [
    path("chat/", chat_with_ai, name="chat_with_ai"),
    path("conversations/", conversation_list, name="conversation_list"),
    path("conversations/<int:conversation_id>/messages/", conversation_messages),
    # path("api/voice-chat/", VoiceChatView.as_view(), name="voice-chat"),
    path('assistant/', include('assistant_vocal.urls')),
    ]
