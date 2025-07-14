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
from django.core.mail import send_mail



User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Générer token même si is_active=False
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Inscription réussie. Un code de confirmation a été envoyé à votre email.",
            "email": user.email,
            "nom_utilisateur": user.nom_utilisateur,
            "token": token.key,  # <- TOKEN ici
        }, status=201)
        

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def put(self, request, *args, **kwargs):
        print(">>> PUT reçu")
        print("Données (request.data) :", request.data)
        print("Fichiers (request.FILES) :", request.FILES)
        return self.update(request, *args, **kwargs)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('nom_utilisateur')  # 👈 On attend ce champ
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)  # 👈 Utilise "username"
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'detail': 'Nom d\'utilisateur ou mot de passe incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

# class TestEmailView(APIView):
#     def get(self, request):
#         send_mail(
#             "Test Tsinjool",
#             "Ceci est un test d'envoi d'email depuis Django.",
#             "Tsinjool <noreply@tsinjool.com>",
#             ["arimisa.dev@gmail.com"],  # ← remplace ici par ton email
#             fail_silently=False,
#         )
#         return Response({"message": "Email envoyé !"})



class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")
        
        if not email or not code:
            return Response({"error": "Email et code sont requis."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)
        
        if user.is_active:
            return Response({"message": "Compte déjà activé."})
        
        if user.confirmation_code == code:
            user.is_active = True
            user.confirmation_code = None
            user.save()
            
            # 👇 AJOUT : Générer le token automatiquement après confirmation
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                "message": "Email confirmé avec succès.",
                "token": token.key,  # 👈 Token pour connexion automatique
                "user": {
                    "email": user.email,
                    "nom_utilisateur": user.nom_utilisateur,
                }
            })
        else:
            return Response({"error": "Code incorrect."}, status=status.HTTP_400_BAD_REQUEST)