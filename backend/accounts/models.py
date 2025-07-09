from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from django.conf import settings

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom_utilisateur, password=None):
        if not email:
            raise ValueError("L'utilisateur doit avoir un email")
        if not nom_utilisateur:
            raise ValueError("L'utilisateur doit avoir un nom d'utilisateur")

        email = self.normalize_email(email)
        user = self.model(email=email, nom_utilisateur=nom_utilisateur)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom_utilisateur, password):
        user = self.create_user(email, nom_utilisateur, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nom_utilisateur = models.CharField(max_length=150, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'nom_utilisateur'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Profile(models.Model):
    COACHING_TYPES = [
        ('life', 'Coaching de vie'),
        ('career', 'Coaching de carrière'),
        ('health', 'Coaching santé'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    coaching_type = models.CharField(max_length=20, choices=COACHING_TYPES)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return f"Profil de {self.user.nom_utilisateur}"