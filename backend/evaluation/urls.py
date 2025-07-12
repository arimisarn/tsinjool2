from django.urls import path

# from accounts import views
from .views import check_assessment_status, get_assessment_questions, get_coaching_path, submit_assessment

urlpatterns = [
    # path('evaluation/', EvaluationView, name='evaluation'),
    # path("evaluation/last/", latest_evaluation),
        path('assessment/questions/<str:coaching_type>/', 
         get_assessment_questions, 
         name='get_assessment_questions'),
    
    path('assessment/submit/', 
         submit_assessment, 
         name='submit_assessment'),
    
    path('coaching-path/', 
         get_coaching_path, 
         name='get_coaching_path'),
    
    path('assessment/status/', 
         check_assessment_status, 
         name='check_assessment_status'),
]
