from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile, CoachingPath
from django.conf import settings


@receiver(post_save, sender=Profile)
def create_coaching_path_for_user(sender, instance, created, **kwargs):
    user = instance.user
    if not CoachingPath.objects.filter(user=user).exists():
        CoachingPath.objects.create(user=user)
