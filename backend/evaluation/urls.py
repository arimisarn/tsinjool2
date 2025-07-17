from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"evaluations", views.EvaluationViewSet, basename="evaluation")
router.register(r"coaching-paths", views.CoachingPathViewSet, basename="coaching-path")
router.register(r"steps", views.StepViewSet, basename="step")
router.register(r"exercises", views.ExerciseViewSet, basename="exercise")

urlpatterns = [
    path("", include(router.urls)),
    path("generate-path/", views.generate_coaching_path, name="generate-path"),
    path("progress/", views.user_progress, name="user-progress"),
    path("dashboard/", views.dashboard_data, name="dashboard-data"),
    path(
        "notifications/", views.NotificationListView.as_view(), name="notification-list"
    ),
    path(
        "notifications/<int:pk>/read/",
        views.mark_notification_as_read,
        name="notification-read",
    ),
    path(
        "notifications/<int:pk>/delete/",
        views.delete_notification,
        name="notification-delete",
    ),
    path("weekly-activity/", views.weekly_activity, name="weekly-activity"),
    path("plan-exercise/", views.plan_exercise),
    path("check-scheduled-exercises/", views.check_scheduled_exercises),
]
