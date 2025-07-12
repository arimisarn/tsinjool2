from django.urls import path
from .views import EvaluationView

urlpatterns = [
    path('evaluation/', EvaluationView, name='evaluation'),
    # path("evaluation/last/", latest_evaluation),
]
