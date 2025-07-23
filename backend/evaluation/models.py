from django.db import models

# from django.contrib.auth.models import User
from django.conf import settings

from django.utils import timezone
import json
from django.contrib.auth import get_user_model
from django.db.models import JSONField


class Evaluation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coaching_type = models.CharField(max_length=20)
    answers = models.JSONField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Évaluation de {self.user.username} - {self.coaching_type}"


class CoachingPath(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    evaluation = models.OneToOneField(
        Evaluation, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Parcours de {self.user.username}"

    @property
    def overall_progress(self):
        total_exercises = Exercise.objects.filter(step__coaching_path=self).count()
        completed_exercises = Exercise.objects.filter(
            step__coaching_path=self, completed=True
        ).count()
        return (
            (completed_exercises / total_exercises * 100) if total_exercises > 0 else 0
        )


class Step(models.Model):
    coaching_path = models.ForeignKey(
        CoachingPath, related_name="steps", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField()
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Étape {self.order}: {self.title}"

    @property
    def progress(self):
        total_exercises = self.exercises.count()
        completed_exercises = self.exercises.filter(completed=True).count()
        return (
            (completed_exercises / total_exercises * 100) if total_exercises > 0 else 0
        )

    def update_completion_status(self):
        """Met à jour le statut de completion de l'étape"""
        if self.exercises.count() > 0:
            self.completed = all(
                exercise.completed for exercise in self.exercises.all()
            )
            self.save()


class Exercise(models.Model):
    EXERCISE_TYPES = [
        ("meditation", "Méditation"),
        ("reflection", "Réflexion"),
        ("practice", "Pratique"),
        ("breathing", "Respiration"),
        ("visualization", "Visualisation"),
    ]

    step = models.ForeignKey(Step, related_name="exercises", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.IntegerField()  # en minutes
    type = models.CharField(max_length=50, choices=EXERCISE_TYPES)
    instructions = models.JSONField()
    animation_character = models.CharField(max_length=10, default="🤖")
    recommended_videos = models.JSONField(default=list)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    coach_tips = models.JSONField(blank=True, default=list)          
     
    def __str__(self):
        return f"{self.title} - {self.step.title}"

    def mark_completed(self):
        """Marque l'exercice comme terminé et met à jour les points"""
        if not self.completed:
            self.completed = True
            self.completed_at = timezone.now()
            self.save()

            try:
                profile = (
                    self.step.coaching_path.user.profile
                )  # <-- .profile et non .userprofile
                profile.points += 10

                if profile.points >= profile.level * 100:
                    profile.level += 1

                profile.save()
            except Exception as e:
                print("❌ Erreur mise à jour points :", e)

            self.step.update_completion_status()




class PlannedExercise(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="plans")
    planned_datetime = models.DateTimeField()

    notified = models.BooleanField(default=False)  # pour indiquer si la notif a déjà été envoyée

    def __str__(self):
        return f"{self.user.username} - {self.exercise.title} @ {self.planned_datetime}"


class UserProgress(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_exercises_completed = models.IntegerField(default=0)
    total_time_spent = models.IntegerField(default=0)  # en minutes
    current_streak = models.IntegerField(default=0)  # jours consécutifs
    last_activity_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Progrès de {self.user.username}"

    def update_activity(self):
        """Met à jour l'activité quotidienne et la série"""
        today = timezone.now().date()

        if self.last_activity_date == today:
            return  # Déjà actif aujourd'hui

        if self.last_activity_date == today - timezone.timedelta(days=1):
            # Activité consécutive
            self.current_streak += 1
        else:
            # Rupture de série
            self.current_streak = 1

        self.last_activity_date = today
        self.save()


User = get_user_model()


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("info", "Info"),
        ("alert", "Alerte"),
        ("success", "Succès"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default="info")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.message[:20]}"
