from django.contrib import admin
from .models import Evaluation, CoachingPath, Notification, Step, Exercise, UserProgress


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ("user", "coaching_type", "completed_at")
    list_filter = ("coaching_type", "completed_at")
    search_fields = ("user__username", "user__email")
    readonly_fields = ("completed_at",)


class ExerciseInline(admin.TabularInline):
    model = Exercise
    extra = 0
    readonly_fields = ("completed", "completed_at")


@admin.register(Step)
class StepAdmin(admin.ModelAdmin):
    list_display = ("title", "coaching_path", "order", "completed", "progress")
    list_filter = ("completed", "coaching_path__evaluation__coaching_type")
    search_fields = ("title", "coaching_path__user__username")
    inlines = [ExerciseInline]


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("title", "step", "type", "duration", "completed")
    list_filter = (
        "type",
        "completed",
        "step__coaching_path__evaluation__coaching_type",
    )
    search_fields = ("title", "step__title", "step__coaching_path__user__username")
    readonly_fields = ("completed_at",)


@admin.register(CoachingPath)
class CoachingPathAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "evaluation",
        "created_at",
        "is_active",
        "overall_progress",
    )
    list_filter = ("is_active", "created_at", "evaluation__coaching_type")
    search_fields = ("user__username", "user__email")


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "total_exercises_completed",
        "total_time_spent",
        "current_streak",
        "last_activity_date",
    )
    search_fields = ("user__username", "user__email")
    readonly_fields = ("last_activity_date",)

admin.site.register(Notification)