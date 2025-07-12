# models.py (ajoutez à vos modèles existants)
from django.db import models
from django.contrib.auth.models import User

class Assessment(models.Model):
    COACHING_TYPES = [
        ('life', 'Coaching de vie'),
        ('career', 'Coaching de carrière'),
        ('health', 'Coaching santé'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
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