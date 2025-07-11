from django.conf import settings
from django.db import models

# Create your models here.
class Evaluation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    answers = models.JSONField()
    resultat_ia = models.TextField(blank=True, null=True)  # <-- Nouveau champ IA
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Évaluation de {self.user.email} ({self.user.profile.coaching_type})"
