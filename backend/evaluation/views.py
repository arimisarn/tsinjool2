# views.py (ajoutez à vos vues existantes)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Assessment, CoachingPath
from accounts.models import Profile
from .questions import ASSESSMENT_QUESTIONS
from .services.ai_service import TogetherAIService
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assessment_questions(request, coaching_type):
    """Récupère les questions d'évaluation selon le type de coaching"""
    
    if coaching_type not in ASSESSMENT_QUESTIONS:
        return Response(
            {'error': 'Type de coaching invalide'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Vérifier que l'utilisateur a bien configuré son profil
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.coaching_type != coaching_type:
            return Response(
                {'error': 'Type de coaching non autorisé'}, 
                status=status.HTTP_403_FORBIDDEN
            )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profil non configuré'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    questions = ASSESSMENT_QUESTIONS[coaching_type]
    
    return Response({
        'coaching_type': coaching_type,
        'questions': questions,
        'total_questions': len(questions)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_assessment(request):
    """Soumet les réponses d'évaluation et génère le parcours IA"""
    
    coaching_type = request.data.get('coaching_type')
    responses = request.data.get('responses')
    
    if not coaching_type or not responses:
        return Response(
            {'error': 'Données manquantes (coaching_type et responses requis)'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validation du type de coaching
    if coaching_type not in ASSESSMENT_QUESTIONS:
        return Response(
            {'error': 'Type de coaching invalide'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Vérifier le profil utilisateur
    try:
        profile = Profile.objects.get(user=request.user)
        if profile.coaching_type != coaching_type:
            return Response(
                {'error': 'Type de coaching non autorisé'}, 
                status=status.HTTP_403_FORBIDDEN
            )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profil non configuré'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Sauvegarder l'évaluation
        assessment, created = Assessment.objects.get_or_create(
            user=request.user,
            coaching_type=coaching_type,
            defaults={'responses': responses}
        )
        
        if not created:
            assessment.responses = responses
            assessment.save()
        
        # Générer l'analyse IA
        ai_service = TogetherAIService()
        ai_analysis = ai_service.analyze_responses(
            coaching_type=coaching_type,
            responses=responses,
            user_bio=profile.bio
        )
        
        # Sauvegarder l'analyse
        assessment.ai_analysis = json.dumps(ai_analysis)
        assessment.save()
        
        # Créer ou mettre à jour le parcours de coaching
        coaching_path, path_created = CoachingPath.objects.get_or_create(
            assessment=assessment,
            defaults={
                'goals': ai_analysis.get('goals', []),
                'recommendations': ai_analysis.get('recommendations', []),
                'timeline': ai_analysis.get('timeline', [])
            }
        )
        
        if not path_created:
            coaching_path.goals = ai_analysis.get('goals', [])
            coaching_path.recommendations = ai_analysis.get('recommendations', [])
            coaching_path.timeline = ai_analysis.get('timeline', [])
            coaching_path.save()
        
        return Response({
            'message': 'Évaluation complétée avec succès',
            'assessment_id': assessment.id,
            'coaching_path_id': coaching_path.id,
            'analysis': ai_analysis.get('analysis', ''),
            'redirect_to_dashboard': True
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors du traitement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_coaching_path(request):
    """Récupère le parcours de coaching de l'utilisateur"""
    
    try:
        # Récupérer le profil pour le type de coaching
        profile = Profile.objects.get(user=request.user)
        
        # Récupérer l'évaluation
        assessment = Assessment.objects.get(
            user=request.user,
            coaching_type=profile.coaching_type
        )
        
        # Récupérer le parcours
        coaching_path = CoachingPath.objects.get(assessment=assessment)
        
        # Parser l'analyse IA
        ai_analysis = {}
        if assessment.ai_analysis:
            try:
                ai_analysis = json.loads(assessment.ai_analysis)
            except json.JSONDecodeError:
                ai_analysis = {}
        
        return Response({
            'coaching_type': profile.coaching_type,
            'assessment': {
                'id': assessment.id,
                'completed_at': assessment.completed_at,
                'responses': assessment.responses
            },
            'analysis': ai_analysis.get('analysis', ''),
            'goals': coaching_path.goals,
            'recommendations': coaching_path.recommendations,
            'timeline': coaching_path.timeline,
            'created_at': coaching_path.created_at,
            'updated_at': coaching_path.updated_at
        })
        
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profil non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Assessment.DoesNotExist:
        return Response(
            {'error': 'Évaluation non trouvée'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except CoachingPath.DoesNotExist:
        return Response(
            {'error': 'Parcours de coaching non trouvé'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Erreur serveur: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_assessment_status(request):
    """Vérifie si l'utilisateur a déjà complété son évaluation"""
    
    try:
        profile = Profile.objects.get(user=request.user)
        
        try:
            assessment = Assessment.objects.get(
                user=request.user,
                coaching_type=profile.coaching_type
            )
            
            return Response({
                'has_completed_assessment': True,
                'assessment_id': assessment.id,
                'completed_at': assessment.completed_at,
                'coaching_type': profile.coaching_type
            })
            
        except Assessment.DoesNotExist:
            return Response({
                'has_completed_assessment': False,
                'coaching_type': profile.coaching_type
            })
            
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profil non configuré'}, 
            status=status.HTTP_400_BAD_REQUEST
        )