from django.urls import path

from backend.accounts import views
from .views import EvaluationView

urlpatterns = [
    # path('evaluation/', EvaluationView, name='evaluation'),
    # path("evaluation/last/", latest_evaluation),
        path('assessment/questions/<str:coaching_type>/', 
         views.get_assessment_questions, 
         name='get_assessment_questions'),
    
    path('assessment/submit/', 
         views.submit_assessment, 
         name='submit_assessment'),
    
    path('coaching-path/', 
         views.get_coaching_path, 
         name='get_coaching_path'),
    
    path('assessment/status/', 
         views.check_assessment_status, 
         name='check_assessment_status'),
]
