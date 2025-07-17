from django.core.management.base import BaseCommand
from django.utils import timezone
from evaluation.models import PlannedExercise
from accounts.utils import send_notification


class Command(BaseCommand):
    help = "Vérifie les exercices planifiés à notifier"

    def handle(self, *args, **kwargs):
        now = timezone.now()
        upcoming = PlannedExercise.objects.filter(
            planned_datetime__lte=now, notified=False
        )

        for plan in upcoming:
            send_notification(
                plan.user,
                f"C'est l'heure de faire l'exercice : {plan.exercise.title}",
                notif_type="info",
            )
            plan.notified = True
            plan.save()

        self.stdout.write(f"{upcoming.count()} notifications envoyées.")
