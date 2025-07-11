from rest_framework import serializers
from .models import Evaluation

class EvaluationSerializer(serializers.ModelSerializer):
    coaching_type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Evaluation
        fields = ['coaching_type', 'answers', 'resultat_ia']

    def get_coaching_type(self, obj):
        return obj.user.profile.coaching_type

    def create(self, validated_data):
        user = self.context['request'].user
        return Evaluation.objects.create(user=user, **validated_data)
