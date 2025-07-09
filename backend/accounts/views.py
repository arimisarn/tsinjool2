from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from .serializers import ProfileSerializer  # import local correctfrom .models import Profile
from .models import Profile
from .models import Profile          # import local correct


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Crée l'utilisateur
        user = serializer.save()

        # Génère le token d'authentification
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Inscription réussie",
            "token": token.key
        }, status=201)
        
        
class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile