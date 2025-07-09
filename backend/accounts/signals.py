from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from allauth.socialaccount.models import SocialAccount

@receiver(user_signed_up)
def populate_profile_from_google(sender, request, user, **kwargs):
    try:
        social_account = SocialAccount.objects.get(user=user, provider='google')
        data = social_account.extra_data
        user.nom = data.get('name', '')
        user.photo = data.get('picture', '')
        user.save()
    except SocialAccount.DoesNotExist:
        pass
