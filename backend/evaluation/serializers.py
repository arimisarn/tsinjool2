from rest_framework import serializers
from .models import Evaluation

class EvaluationSerializer(serializers.ModelSerializer):
    coaching_type = serializers.SerializerMethodField()

    class Meta:
        model = Evaluation
        fields = ['id', 'answers', 'resultat_ia', 'coaching_type', 'created_at']

    def get_coaching_type(self, obj):
        return obj.user.profile.coaching_type
