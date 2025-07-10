from django.urls import path
from .views import RegisterView, ProfileUpdateView, TestEmailView
from rest_framework.authtoken.views import ObtainAuthToken
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', ObtainAuthToken.as_view(), name='api-login'),
    path('profile/', ProfileUpdateView.as_view(), name='profile'),
    path("test-email/", TestEmailView.as_view()),

]
