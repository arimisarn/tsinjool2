import random
from django.core.mail import send_mail

def generate_confirmation_code():
    return str(random.randint(100000, 999999))

def send_confirmation_email(email, code):
    send_mail(
        "Confirmation de votre compte Tsinjool",
        f"Bonjour,\n\nVoici votre code de confirmation : {code}\n\nMerci.",
        "Tsinjool <noreply@tsinjool.com>",
        [email],
        fail_silently=False,
    )
