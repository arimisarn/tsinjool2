import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

def generate_confirmation_code(length=6):
    """Génère un code aléatoire de confirmation (ex: 6 chiffres)."""
    return ''.join(random.choices(string.digits, k=length))

def send_confirmation_email(email, code):
    subject = "Confirme ton adresse email - Tsinjool"
    from_email = "Tsinjool <noreply@tsinjool.com>"
    to = [email]

    context = {
        'confirmation_code': code,
        'user_email': email,
        'site_name': 'Tsinjool',
    }

    # HTML version (tu peux créer un fichier .html pour ça)
    html_content = render_to_string("emails/confirmation_email.html", context)

    # Plaintext fallback
    text_content = f"Ton code de confirmation : {code}"

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
