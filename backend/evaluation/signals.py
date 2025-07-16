# accounts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile
from coaching.models import CoachingPath


@receiver(post_save, sender=Profile)
def create_user_path(sender, instance, created, **kwargs):
    if created:
        CoachingPath.objects.get_or_create(user=instance.user)

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.get_or_create(user=instance)