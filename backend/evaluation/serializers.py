from rest_framework import serializers
from .models import Evaluation, CoachingPath, Notification, Step, Exercise, UserProgress
from .utils import get_image_from_pexels


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ("id", "coaching_type", "answers", "completed_at")
        read_only_fields = ("id", "completed_at")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = (
            "id",
            "title",
            "description",
            "duration",
            "type",
            "instructions",
            "animation_character",
            "recommended_videos",
            "completed",
            "completed_at",
            "image_url"
        )
        read_only_fields = ("completed", "completed_at")


class ExerciseCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ("id", "completed")
        read_only_fields = ("id",)


class StepSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)
    progress = serializers.ReadOnlyField()

    class Meta:
        model = Step
        fields = (
            "id",
            "title",
            "description",
            "order",
            "completed",
            "progress",
            "exercises",
        )


class CoachingPathSerializer(serializers.ModelSerializer):
    steps = StepSerializer(many=True, read_only=True)
    overall_progress = serializers.ReadOnlyField()

    class Meta:
        model = CoachingPath
        fields = ("id", "created_at", "is_active", "overall_progress", "steps")


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = (
            "total_exercises_completed",
            "total_time_spent",
            "current_streak",
            "last_activity_date",
        )


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "message", "type", "is_read", "created_at"]
