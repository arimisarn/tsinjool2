from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model, authenticate
from rest_framework.permissions import AllowAny
from .serializers import (
    ProfileSerializer,
)  # import local correctfrom .models import Profile
from .models import Profile
from rest_framework.views import APIView
from .models import Profile  # import local correct
from rest_framework import status
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser
from .supabase_client import supabase
from django.core.files.uploadedfile import UploadedFile
from .supabase_client import supabase
from rest_framework.decorators import api_view, permission_classes

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

        return Response(
            {
                "message": "Inscription réussie. Un code de confirmation a été envoyé à votre email.",
                "email": user.email,
                "nom_utilisateur": user.nom_utilisateur,
                "token": token.key,  # <- TOKEN ici
            },
            status=201,
        )


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # pour gérer form-data

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def put(self, request, *args, **kwargs):
        profile = self.get_object()

        bio = request.data.get("bio", profile.bio)
        coaching_type = request.data.get("coaching_type", profile.coaching_type)
        photo_file = request.FILES.get("photo")

        photo_url = profile.photo_url

        try:
            if photo_file:
                file_name = f"avatar/{request.user.id}_{photo_file.name}"

                # Upload du fichier vers Supabase
                upload_resp = supabase.storage.from_("avatar").upload(
                    file_name,
                    photo_file.read(),
                    {"content-type": photo_file.content_type},
                )

                if upload_resp.error:
                    return Response(
                        {"detail": "Erreur lors de l’upload Supabase."}, status=400
                    )

                # Récupération de l’URL publique
                public_url_resp = supabase.storage.from_("avatar").get_public_url(
                    file_name
                )
                photo_url = public_url_resp.public_url

                if not photo_url:
                    return Response({"detail": "URL publique introuvable."}, status=500)

            # Mise à jour du profil
            profile.bio = bio
            profile.coaching_type = coaching_type
            profile.photo_url = photo_url
            profile.save()

            serializer = self.get_serializer(profile)
            return Response(serializer.data, status=200)

        except Exception as e:
            import traceback

            traceback.print_exc()
            return Response({"detail": f"Erreur serveur : {str(e)}"}, status=500)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get("nom_utilisateur")  # 👈 On attend ce champ
        password = request.data.get("password")

        user = authenticate(
            request, username=username, password=password
        )  # 👈 Utilise "username"
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        return Response(
            {"detail": "Nom d'utilisateur ou mot de passe incorrect."},
            status=status.HTTP_400_BAD_REQUEST,
        )


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
            return Response(
                {"error": "Email et code sont requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND
            )

        if user.is_active:
            return Response({"message": "Compte déjà activé."})

        if user.confirmation_code == code:
            user.is_active = True
            user.confirmation_code = None
            user.save()

            # 👇 AJOUT : Générer le token automatiquement après confirmation
            token, created = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "message": "Email confirmé avec succès.",
                    "token": token.key,  # 👈 Token pour connexion automatique
                    "user": {
                        "email": user.email,
                        "nom_utilisateur": user.nom_utilisateur,
                    },
                }
            )
        else:
            return Response(
                {"error": "Code incorrect."}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["GET"])
@permission_classes([AllowAny])
def test_supabase_view(request):
    try:
        result = supabase.storage.from_("avatar").list()
        return Response({"success": True, "result": result})
    except Exception as e:
        return Response({"success": False, "error": str(e)})