# services/ai_service.py (nouveau fichier)
import os
import requests
import json
from django.conf import settings

class TogetherAIService:
    def __init__(self):
        self.api_key = os.getenv('MISTRAL_API_KEY')
        self.base_url = "https://api.together.xyz/v1/chat/completions"
    
    def analyze_responses(self, coaching_type, responses, user_bio):
        """Analyse les réponses et génère un parcours personnalisé"""
        try:
            prompt = self._build_analysis_prompt(coaching_type, responses, user_bio)
            
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "meta-llama/Llama-2-70b-chat-hf",
                    "messages": [
                        {
                            "role": "system", 
                            "content": "Tu es un coach expert en développement personnel. Tu analyses les réponses d'évaluation et génères des parcours personnalisés. Réponds UNIQUEMENT en JSON valide."
                        },
                        {
                            "role": "user", 
                            "content": prompt
                        }
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                ai_response = response.json()
                content = ai_response['choices'][0]['message']['content']
                
                # Nettoyer et parser le JSON
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    # Fallback si le JSON n'est pas valide
                    return self._generate_fallback_analysis(coaching_type, responses)
            else:
                return self._generate_fallback_analysis(coaching_type, responses)
                
        except Exception as e:
            print(f"Erreur AI Service: {e}")
            return self._generate_fallback_analysis(coaching_type, responses)
    
    def _build_analysis_prompt(self, coaching_type, responses, user_bio):
        coaching_labels = {
            'life': 'Coaching de vie',
            'career': 'Coaching de carrière', 
            'health': 'Coaching santé'
        }
        
        prompt = f"""
        Analyse les réponses d'évaluation pour un {coaching_labels.get(coaching_type, coaching_type)}:

        Bio de l'utilisateur: {user_bio or 'Non renseigné'}

        Réponses de l'évaluation:
        {json.dumps(responses, indent=2, ensure_ascii=False)}

        Génère un parcours personnalisé au format JSON avec exactement cette structure:
        {{
            "analysis": "Analyse détaillée des réponses en 2-3 phrases",
            "goals": [
                {{
                    "title": "Objectif 1",
                    "description": "Description détaillée",
                    "priority": "high|medium|low",
                    "timeline": "1-3 mois"
                }}
            ],
            "recommendations": [
                {{
                    "category": "Action",
                    "title": "Recommandation 1",
                    "description": "Description pratique",
                    "frequency": "quotidien|hebdomadaire|mensuel"
                }}
            ],
            "timeline": [
                {{
                    "week": 1,
                    "focus": "Focus de la semaine",
                    "actions": ["Action 1", "Action 2"]
                }}
            ]
        }}

        Concentre-toi sur des conseils pratiques et réalisables.
        """
        return prompt
    
    def _generate_fallback_analysis(self, coaching_type, responses):
        """Génère une analyse de base si l'IA échoue"""
        fallback_data = {
            'life': {
                'analysis': 'Votre évaluation révèle des aspirations importantes en développement personnel. Nous allons créer un parcours adapté à vos besoins.',
                'goals': [
                    {
                        'title': 'Améliorer l\'équilibre vie-travail',
                        'description': 'Développer une meilleure harmonie entre vie professionnelle et personnelle',
                        'priority': 'high',
                        'timeline': '2-3 mois'
                    }
                ]
            },
            'career': {
                'analysis': 'Votre profil professionnel montre un potentiel de développement important. Nous allons structurer votre évolution de carrière.',
                'goals': [
                    {
                        'title': 'Développer les compétences clés',
                        'description': 'Identifier et renforcer les compétences essentielles pour votre évolution',
                        'priority': 'high',
                        'timeline': '3-6 mois'
                    }
                ]
            },
            'health': {
                'analysis': 'Votre évaluation santé révèle des axes d\'amélioration concrets. Nous allons créer un plan bien-être personnalisé.',
                'goals': [
                    {
                        'title': 'Améliorer la condition physique',
                        'description': 'Développer une routine d\'exercice adaptée à votre mode de vie',
                        'priority': 'high',
                        'timeline': '1-2 mois'
                    }
                ]
            }
        }
        
        base_data = fallback_data.get(coaching_type, fallback_data['life'])
        
        return {
            'analysis': base_data['analysis'],
            'goals': base_data['goals'],
            'recommendations': [
                {
                    'category': 'Action',
                    'title': 'Commencer par de petites actions',
                    'description': 'Mettre en place des habitudes simples et progressives',
                    'frequency': 'quotidien'
                }
            ],
            'timeline': [
                {
                    'week': 1,
                    'focus': 'Évaluation et planification',
                    'actions': ['Définir les priorités', 'Créer un planning']
                }
            ]
        }