from django.apps import AppConfig


class CoachingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "evaluation"


# accounts/apps.py
def ready(self):
    import evaluation.signals
