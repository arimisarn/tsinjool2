from rest_framework import serializers
from .models import CustomUser
from .models import Profile
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

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
        user = User.objects.create_user(
            email=validated_data['email'],
            nom_utilisateur=validated_data['nom_utilisateur'],
            password=validated_data['password']
        )
        Token.objects.create(user=user)
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