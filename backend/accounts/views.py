from rest_framework import generics
from .serializers import RegisterSerializer
from .models import CustomUser
from rest_framework import generics, permissions
from .serializers import ProfileSerializer
from .models import Profile

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer


class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile