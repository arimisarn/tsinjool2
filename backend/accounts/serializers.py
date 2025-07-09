# accounts/serializers.py

from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'nom', 'photo']
        read_only_fields = ['nom', 'photo']

    def create(self, validated_data):
        email = validated_data['email']
        password = validated_data.get('password')
        nom = email.split('@')[0].capitalize()
        user = CustomUser.objects.create_user(email=email, password=password, nom=nom)
        return user
