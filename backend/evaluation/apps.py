from django.apps import AppConfig


class CoachingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "evaluation"


def ready(self):
    import evalution.signals  # si ton signal est dans l’app `accounts`
