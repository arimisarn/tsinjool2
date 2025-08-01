import json
import traceback
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions
from .models import (
    Evaluation,
    CoachingPath,
    Notification,
    PlannedExercise,
    Step,
    Exercise,
    UserProgress,
)
from .serializers import (
    EvaluationSerializer,
    CoachingPathSerializer,
    NotificationSerializer,
    PlannedExerciseSerializer,
    StepSerializer,
    ExerciseSerializer,
    UserProgressSerializer,
)
from .utils import send_notification
from .ai_service import AICoachingService
from rest_framework.views import APIView
from .ai_service import AICoachingService, get_youtube_url_from_title
from django.conf import settings
from datetime import timedelta
from django.utils.timezone import now
from collections import defaultdict
from .utils import get_image_from_pexels, send_notification
from django.utils.dateparse import parse_datetime
from .tasks import send_scheduled_notification


class EvaluationViewSet(viewsets.ModelViewSet):
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Evaluation.objects.filter(user=self.request.user)

    def create(self, request):
        """Créer une nouvelle évaluation"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            evaluation = serializer.save()
            return Response(
                {"id": evaluation.id, "message": "Évaluation enregistrée avec succès"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_coaching_path(request):
    evaluation_id = request.data.get("evaluation_id")
    if not evaluation_id:
        return Response(
            {"error": "evaluation_id requis"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        evaluation = get_object_or_404(Evaluation, id=evaluation_id, user=request.user)

        existing_path = CoachingPath.objects.filter(user=request.user).first()
        if existing_path:
            existing_path.delete()

        evaluation_data = {
            "coaching_type": evaluation.coaching_type,
            "answers": evaluation.answers,
        }

        # Générer le parcours avec IA
        steps_data = AICoachingService.generate_coaching_path(evaluation_data)
        print("DEBUG - Données générées par l'IA :", steps_data)
        print(json.dumps(steps_data, indent=2))

        # Recherche des URLs YouTube pour chaque vidéo recommandée
        youtube_api_key = settings.YOUTUBE_API_KEY
        for step_data in steps_data:
            for exercise_data in step_data.get("exercises", []):
                new_urls = []
                for video_title in exercise_data.get("recommended_videos", []):
                    url = get_youtube_url_from_title(video_title, youtube_api_key)
                    if url:
                        new_urls.append(url)
                exercise_data["recommended_videos"] = new_urls

        coaching_path = CoachingPath.objects.create(
            user=request.user,
            evaluation=evaluation,
            is_active=True,
        )

        for step_data in steps_data:
            step = Step.objects.create(
                coaching_path=coaching_path,
                title=step_data["title"],
                description=step_data["description"],
                order=step_data["order"],
            )

            for exercise_data in step_data["exercises"]:
                instructions = exercise_data.get("instructions", [])
                image_url = get_image_from_pexels(exercise_data["title"])
                if isinstance(instructions, str):
                    try:
                        instructions = json.loads(instructions)
                    except Exception:
                        instructions = ["Instructions indisponibles"]

                recommended_videos = exercise_data.get("recommended_videos", [])
                if isinstance(recommended_videos, str):
                    try:
                        recommended_videos = json.loads(recommended_videos)
                    except Exception:
                        recommended_videos = []
                coach_tips = exercise_data.get("coach_tips", [])
                if isinstance(coach_tips, str):
                    try:
                        coach_tips = json.loads(coach_tips)
                    except Exception:
                        coach_tips = []
                print("💡 coach_tips récupéré :", coach_tips)                
                exercise = Exercise.objects.create(
                    step=step,
                    title=exercise_data["title"],
                    description=exercise_data["description"],
                    duration=exercise_data["duration"],
                    type=exercise_data["type"],
                    instructions=instructions,
                    animation_character=exercise_data.get("animation_character", "🤖"),
                    recommended_videos=recommended_videos,
                    image_url=image_url, 
                    coach_tips=coach_tips,
                )
                print("✅ Exercice sauvegardé :", exercise.id)
                print("📦 Tips enregistrés :", exercise.coach_tips)
                print("🧠 coach_tips avant insertion :", exercise_data.get("coach_tips"))


        UserProgress.objects.get_or_create(user=request.user)

        serializer = CoachingPathSerializer(coaching_path)
        send_notification(
            request.user,
            "🎯 Votre parcours de coaching a été généré avec succès !",
            "success",
        )

        return Response(
            {
                "message": "Parcours généré avec succès",
                "coaching_path": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print("ERREUR lors de la génération du parcours IA :", str(e))
        send_notification(
            request.user,
            "❌ Une erreur est survenue lors de la génération de votre parcours. Veuillez réessayer.",
            "alert",
        )
        print("DEBUG - Erreur :", str(e))
        return Response(
            {"error": f"Erreur lors de la génération du parcours : {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class CoachingPathViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CoachingPathSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CoachingPath.objects.filter(user=self.request.user)

    @action(detail=False, methods=["get"])
    def my(self, request):
        """Récupère le parcours du user connecté"""
        try:
            coaching_path = CoachingPath.objects.get(user=request.user)
            serializer = self.get_serializer(coaching_path)
            return Response(serializer.data)
        except CoachingPath.DoesNotExist:
            return Response(
                {"error": "Aucun parcours de coaching trouvé"},
                status=status.HTTP_404_NOT_FOUND,
            )


class CoachingPathRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile  # ou Profile.objects.get(user=request.user)
        if not profile or not profile.coaching_type:
            return Response({"detail": "Type de coaching non défini."}, status=400)

        # Exemple de données IA fictives
        data = {
            "coaching_type": profile.coaching_type,
            "steps": [
                {"title": "Étape 1", "description": "Introduction"},
                {"title": "Étape 2", "description": "Objectifs"},
            ],
        }
        return Response(data)


# class StepViewSet(viewsets.ReadOnlyModelViewSet):
#     serializer_class = StepSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Step.objects.filter(coaching_path__user=self.request.user)


class StepViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StepSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Step.objects.filter(coaching_path__user=self.request.user)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        step = self.get_object()
        if step.completed:
            return Response(
                {"message": "Étape déjà terminée"}, status=status.HTTP_200_OK
            )

        step.completed = True
        step.save()

        # ✅ Notifier l'utilisateur
        from .utils import send_notification

        send_notification(
            request.user,
            f"🎯 Vous avez terminé l’étape « {step.title} ». Félicitations !",
            "success",
        )

        return Response(
            {"message": "Étape terminée avec succès"},
            status=status.HTTP_200_OK,
        )


class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Exercise.objects.filter(step__coaching_path__user=self.request.user)

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        """Marquer un exercice comme terminé"""
        exercise = self.get_object()

        if exercise.completed:
            return Response(
                {"message": "Exercice déjà terminé"}, status=status.HTTP_200_OK
            )

        # ✅ Marquer comme terminé (cela met aussi à jour les points et le niveau)
        exercise.mark_completed()
        # ✅ Vérifier si l'étape entière est terminée
        step = exercise.step
        total = step.exercises.count()
        completed = step.exercises.filter(completed=True).count()

        # ✅ Mettre à jour les progrès utilisateur
        user_progress, created = UserProgress.objects.get_or_create(user=request.user)
        user_progress.total_exercises_completed += 1
        user_progress.total_time_spent += exercise.duration
        user_progress.update_activity()

        try:
            total_points = request.user.profile.points
        except Exception:
            total_points = 0  # fallback si le profil n'existe pas

        if completed == total:
            send_notification(
                request.user,
                f"🏁 Vous avez terminé l'étape « {step.title} ». Continuez comme ça !",
                "success",
            )
        return Response(
            {
                "message": "Exercice terminé avec succès",
                "points_earned": 10,
                "total_points": total_points,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"])
    def recommendations(self, request, pk=None):
        """Obtenir des recommandations de vidéos pour un exercice"""
        exercise = self.get_object()

        videos = AICoachingService.generate_video_recommendations(
            exercise.type, exercise.step.coaching_path.evaluation.coaching_type
        )

        return Response({"recommended_videos": videos})

    @action(detail=True, methods=["post"])
    def schedule(self, request, pk=None):
        """Planifier une notification pour un exercice"""
        try:
            datetime_str = request.data.get("scheduled_datetime")
            if not datetime_str:
                return Response({"error": "Date/heure manquante"}, status=400)

            scheduled_dt = parse_datetime(datetime_str)
            if not scheduled_dt:
                return Response({"error": "Format de date invalide"}, status=400)

            # 💡 Planifie la tâche (via Celery ou autre)
            send_scheduled_notification.apply_async(
                args=[request.user.id, pk], eta=scheduled_dt
            )

            return Response({"message": "Notification planifiée avec succès"})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_progress(request):
    """Récupérer les statistiques de progression de l'utilisateur"""

    try:
        progress = UserProgress.objects.get(user=request.user)
        serializer = UserProgressSerializer(progress)

        # ⚠️ Récupérer ou fallback pour userprofile
        try:
            profile = request.user.userprofile
            level = profile.level
            points = profile.points
        except Exception:
            level = 1
            points = 0

        # Ajouter des statistiques supplémentaires
        coaching_path = CoachingPath.objects.filter(user=request.user).first()
        additional_stats = {}

        if coaching_path:
            total_steps = coaching_path.steps.count()
            completed_steps = coaching_path.steps.filter(completed=True).count()

            additional_stats = {
                "total_steps": total_steps,
                "completed_steps": completed_steps,
                "overall_progress": coaching_path.overall_progress,
            }

        return Response(
            {
                **serializer.data,
                **additional_stats,
                "current_level": level,
                "total_points": points,
            }
        )

    except UserProgress.DoesNotExist:
        # Cas rare si pas de UserProgress
        try:
            profile = request.user.userprofile
            level = profile.level
            points = profile.points
        except Exception:
            level = 1
            points = 0

        return Response(
            {
                "total_exercises_completed": 0,
                "total_time_spent": 0,
                "current_streak": 0,
                "last_activity_date": None,
                "total_steps": 0,
                "completed_steps": 0,
                "overall_progress": 0,
                "current_level": level,
                "total_points": points,
            }
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    """Récupérer toutes les données nécessaires pour le dashboard"""

    try:
        # Profil utilisateur
        profile = request.user.userprofile

        # Parcours de coaching
        coaching_path = CoachingPath.objects.filter(user=request.user).first()

        # Progrès utilisateur
        user_progress, created = UserProgress.objects.get_or_create(user=request.user)

        response_data = {
            "user_profile": {
                "name": f"{request.user.first_name} {request.user.last_name}".strip()
                or request.user.username,
                "photo": profile.photo.url if profile.photo else None,
                "coaching_type": profile.coaching_type,
                "level": profile.level,
                "points": profile.points,
                "is_profile_complete": profile.is_profile_complete,
            },
            "coaching_path": None,
            "progress": {
                "total_exercises_completed": user_progress.total_exercises_completed,
                "total_time_spent": user_progress.total_time_spent,
                "current_streak": user_progress.current_streak,
                "overall_progress": 0,
            },
        }

        if coaching_path:
            serializer = CoachingPathSerializer(coaching_path)
            response_data["coaching_path"] = serializer.data
            response_data["progress"][
                "overall_progress"
            ] = coaching_path.overall_progress

        return Response(response_data)

    except Exception as e:
        return Response(
            {"error": f"Erreur lors du chargement des données: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_as_read(request, pk):
    try:
        notif = Notification.objects.get(id=pk, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({"message": "Notification marquée comme lue."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification introuvable."}, status=404)


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def delete_notification(request, pk):
    try:
        notif = Notification.objects.get(id=pk, user=request.user)
        notif.delete()
        return Response({"message": "Notification supprimée."})
    except Notification.DoesNotExist:
        return Response({"error": "Notification introuvable."}, status=404)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def weekly_activity(request):
    user = request.user
    today = now().date()
    start_of_week = today - timedelta(days=today.weekday())  # Lundi

    # Initialisation des jours
    days_labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
    data = {label: {"exercises": 0, "time": 0} for label in days_labels}

    exercises = Exercise.objects.filter(
        step__coaching_path__user=user,
        completed=True,
        completed_at__date__gte=start_of_week,
    )

    for ex in exercises:
        day = ex.completed_at.strftime("%a")  # Ex: 'Mon'
        fr_day = {
            "Mon": "Lun",
            "Tue": "Mar",
            "Wed": "Mer",
            "Thu": "Jeu",
            "Fri": "Ven",
            "Sat": "Sam",
            "Sun": "Dim",
        }.get(day, "Lun")

        data[fr_day]["exercises"] += 1
        data[fr_day]["time"] += ex.duration

    # Format pour le frontend
    result = [{"day": day, **values} for day, values in data.items()]
    return Response(result)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def plan_exercise(request):
    user = request.user
    exercise_id = request.data.get("exercise_id")
    planned_datetime = request.data.get("planned_datetime")

    if not exercise_id or not planned_datetime:
        return Response({"error": "Champs manquants"}, status=400)

    try:
        exercise = Exercise.objects.get(id=exercise_id)
        PlannedExercise.objects.create(
            user=user,
            exercise=exercise,
            planned_datetime=planned_datetime,
        )
        return Response({"success": "Exercice planifié avec succès"})
    except Exercise.DoesNotExist:
        return Response({"error": "Exercice non trouvé"}, status=404)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_scheduled_exercises(request):
    user = request.user
    now = timezone.now()
    print("🔍 Vérification pour :", user)

    upcoming = PlannedExercise.objects.filter(
        user=user,
        planned_datetime__lte=now,
        notified=False,
    )

    count = 0
    for plan in upcoming:
        send_notification(
            user,
            f"C'est l'heure de faire l'exercice : {plan.exercise.title}",
            notif_type="info",
        )
        plan.notified = True
        plan.save()
        count += 1

    print(f"➡️ {count} notification(s) envoyée(s)")
    return Response({"notifications_sent": count})


class PlannedExerciseListView(generics.ListAPIView):
    serializer_class = PlannedExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PlannedExercise.objects.filter(user=self.request.user).order_by(
            "planned_datetime"
        )


class UnreadNotificationsView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user, is_read=False
        ).order_by("-created_at")
