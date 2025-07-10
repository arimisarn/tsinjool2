from rest_framework import serializers
from .models import CustomUser
from .models import Profile
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
User = get_user_model()
from .utils import generate_confirmation_code, send_confirmation_email
from rest_framework.validators import UniqueValidator


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Un utilisateur avec cet email existe déjà.")]
    )
    nom_utilisateur = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all(), message="Ce nom d'utilisateur est déjà pris.")]
    )

    class Meta:
        model = User
        fields = ['email', 'nom_utilisateur', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        # Générer code de confirmation
        code = generate_confirmation_code()

        user = User.objects.create_user(
            email=validated_data['email'],
            nom_utilisateur=validated_data['nom_utilisateur'],
            password=validated_data['password'],
        )

        # Désactiver le compte jusqu'à confirmation
        user.is_active = False
        user.confirmation_code = code
        user.save()

        # Envoyer email de confirmation
        send_confirmation_email(user.email, code)

        return user
    

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'coaching_type', 'photo']
        extra_kwargs = {
            'photo': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True},
            'coaching_type': {'required': True},
        }