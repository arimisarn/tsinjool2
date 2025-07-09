from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid

class CustomUserManager(BaseUserManager):
    def create_user(self, email, nom_utilisateur, password=None, **extra_fields):
        if not email:
            raise ValueError('L’email est obligatoire.')
        if not nom_utilisateur:
            raise ValueError('Le nom d’utilisateur est obligatoire.')
        email = self.normalize_email(email)
        user = self.model(email=email, nom_utilisateur=nom_utilisateur, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom_utilisateur, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, nom_utilisateur, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    nom_utilisateur = models.CharField(max_length=150, unique=True)
    photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    facebook_id = models.CharField(max_length=100, blank=True, null=True)
    is_facebook_user = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom_utilisateur']

    objects = CustomUserManager()

    def __str__(self):
        return self.email
