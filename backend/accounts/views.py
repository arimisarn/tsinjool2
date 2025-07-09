from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model, authenticate
from rest_framework.permissions import AllowAny
from .serializers import ProfileSerializer  # import local correctfrom .models import Profile
from .models import Profile
from rest_framework.views import APIView
from .models import Profile          # import local correct
from rest_framework import status



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


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('nom_utilisateur')  # 👈 On attend ce champ
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)  # 👈 Utilise "username"
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'detail': 'Nom d\'utilisateur ou mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

