from rest_framework import serializers
from .models import CustomUser
from .models import Profile
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



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'coaching_type', 'photo']
        extra_kwargs = {
            'photo': {'required': False, 'allow_null': True},
            'bio': {'required': False, 'allow_blank': True},
            'coaching_type': {'required': True},
        }