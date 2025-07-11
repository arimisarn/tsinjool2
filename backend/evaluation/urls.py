from django.urls import path
from .views import EvaluationView, latest_evaluation

urlpatterns = [
    path("evaluation/", EvaluationView.as_view()),
    path("evaluation/last/", latest_evaluation),
]
