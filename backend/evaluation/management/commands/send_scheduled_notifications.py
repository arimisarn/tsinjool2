# notifications/management/commands/send_scheduled_notifications.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from evaluation.models import ScheduledExercise
from evaluation.models import Notification
from evaluation.utils import send_notification

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        now = timezone.now()
        exercises = ScheduledExercise.objects.filter(
            scheduled_datetime__lte=now,
            notified=False
        )
        for ex in exercises:
            send_notification(
                user=ex.user,
                message=f"Il est temps de faire « {ex.exercise.title} »",
                notif_type="info"
            )
            ex.notified = True
            ex.save()
