from .models import Notification, Exercise
from django.contrib.auth import get_user_model

User = get_user_model()

# @shared_task
def send_scheduled_notification(user_id, exercise_id):
    user = User.objects.get(id=user_id)
    exercise = Exercise.objects.get(id=exercise_id)

    Notification.objects.create(
        user=user,
        message=f"⏰ Il est temps de faire l’exercice « {exercise.title} » !",
        type="alert"
    )
