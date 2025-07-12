# serializers.py (ajoutez à vos serializers existants)
from rest_framework import serializers
from .models import Assessment, CoachingPath

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ['id', 'coaching_type', 'responses', 'completed_at']
        read_only_fields = ['id', 'completed_at']

class CoachingPathSerializer(serializers.ModelSerializer):
    assessment = AssessmentSerializer(read_only=True)
    
    class Meta:
        model = CoachingPath
        fields = ['id', 'assessment', 'goals', 'recommendations', 'timeline', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']