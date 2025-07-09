from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True, label="Confirmer mot de passe")

    class Meta:
        model = CustomUser
        fields = ['email', 'nom_utilisateur', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user
