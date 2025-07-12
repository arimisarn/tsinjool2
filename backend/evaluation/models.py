from django.db import models
from django.conf import settings

class Assessment(models.Model):
    COACHING_TYPES = [
        ('life', 'Coaching de vie'),
        ('career', 'Coaching de carrière'),
        ('health', 'Coaching santé'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    coaching_type = models.CharField(max_length=20, choices=COACHING_TYPES)
    responses = models.JSONField()
    ai_analysis = models.TextField(blank=True, null=True)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'coaching_type']

class CoachingPath(models.Model):
    assessment = models.OneToOneField(Assessment, on_delete=models.CASCADE)
    goals = models.JSONField()
    recommendations = models.JSONField()
    timeline = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# models.py
class ProgressStep(models.Model):
    coaching_path = models.ForeignKey(CoachingPath, on_delete=models.CASCADE, related_name="steps")
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.title} ({'✔' if self.completed else '✘'})"