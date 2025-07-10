import random
import string
from django.core.mail import send_mail
from django.conf import settings

def generate_confirmation_code(length=6):
    """Génère un code aléatoire de confirmation (ex: 6 chiffres)."""
    return ''.join(random.choices(string.digits, k=length))

def send_confirmation_email(email, code):
    """Envoie l'email de confirmation contenant le code."""
    subject = "Confirmation de votre adresse email"
    message = f"Bonjour,\n\nVoici votre code de confirmation : {code}\n\nMerci de l'entrer pour activer votre compte."
    from_email = settings.DEFAULT_FROM_EMAIL

    send_mail(subject, message, from_email, [email])
