from rest_framework import serializers
from .models import CustomUser
from .models import Profile
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()
from .utils import generate_confirmation_code, send_confirmation_email
from rest_framework.validators import UniqueValidator


User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="Cet email est déjà utilisé."
            )
        ],
    )
    nom_utilisateur = serializers.CharField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Ce nom d'utilisateur est déjà pris.",
            )
        ],
    )

    class Meta:
        model = User
        fields = ["email", "nom_utilisateur", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        validated_data.pop("password2")

        # Générer un code de confirmation
        code = generate_confirmation_code()

        user = User.objects.create_user(
            email=validated_data["email"],
            nom_utilisateur=validated_data["nom_utilisateur"],
            password=validated_data["password"],
        )

        user.is_active = False
        user.confirmation_code = code
        user.save()

        # Envoyer email
        send_confirmation_email(user.email, code)

        return user


# Serializer


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["bio", "coaching_type", "photo_url", "user"]
        extra_kwargs = {
            "bio": {"required": False, "allow_blank": True},
            "coaching_type": {"required": True},
            "photo_url": {"required": False, "allow_blank": True},
        }

    def get_user(self, obj):
        return {
            "nom_utilisateur": obj.user.nom_utilisateur,
            "email": obj.user.email,
        }
