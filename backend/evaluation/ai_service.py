import requests
import json
from django.conf import settings
from typing import Dict, List, Any
import re


class AICoachingService:
    """Service pour l'intégration avec Together.ai"""

    BASE_URL = "https://api.together.xyz/v1/chat/completions"

    @classmethod
    def generate_coaching_path(cls, evaluation_data: Dict[str, Any]) -> List[Dict]:
        """Génère un parcours de coaching personnalisé avec Together.ai"""

        prompt = cls._build_coaching_prompt(evaluation_data)

        try:
            response = requests.post(
                cls.BASE_URL,
                headers={
                    "Authorization": f"Bearer {settings.MISTRAL_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                    "messages": [
                        {
                            "role": "system",
                            "content": "Tu es un coach professionnel expérimenté. Tu crées des parcours de coaching personnalisés basés sur les évaluations des clients.",
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2048,
                },
            )

            if response.status_code == 200:
                ai_response = response.json()
                content = ai_response["choices"][0]["message"]["content"]

                # ✅ Afficher la réponse brute de l'IA dans les logs
                print("🧠 Réponse brute de l’IA (non parsée) :\n", content)

                return cls._parse_coaching_response(
                    content, evaluation_data["coaching_type"]
                )
            else:
                print(
                    f"❌ Erreur API Together.ai: {response.status_code} - {response.text}"
                )
                return cls._get_default_coaching_path(evaluation_data["coaching_type"])

        except Exception as e:
            print(f"❌ Erreur lors de l'appel à Together.ai: {str(e)}")
            return cls._get_default_coaching_path(evaluation_data["coaching_type"])

    @classmethod
    def _build_coaching_prompt(cls, evaluation_data: Dict[str, Any]) -> str:
        """Construit le prompt pour l'IA"""

        coaching_type = evaluation_data["coaching_type"]
        answers = evaluation_data["answers"]

        answers_text = "\n".join(
            [f"Question {q_id}: {answer}" for q_id, answer in answers.items()]
        )

        coaching_labels = {
            "life": "coaching de vie",
            "career": "coaching de carrière",
            "health": "coaching santé",
        }

        coaching_label = coaching_labels.get(coaching_type, coaching_type)

        return f"""
Tu es un coach professionnel expérimenté. Crée un parcours de coaching personnalisé en {coaching_label}, basé sur les réponses suivantes du client :

{answers_text}

Génère exactement 4 étapes progressives (ni plus, ni moins). Chaque étape doit avoir :
- un titre
- une description
- exactement 2 exercices

Chaque exercice contient :
- un titre engageant
- une description (1 phrase)
- une durée (entre 5 et 30 minutes)
- un type parmi : meditation, reflection, practice, breathing, visualization
- 3 instructions claires
- un emoji de personnage pour l'animation
- URLs complètes de vidéos YouTube recommandées** (commençant par https://www.youtube.com/watch?v=)

⚠️ Réponds UNIQUEMENT avec un JSON **strictement valide**, **sans texte explicatif** ni commentaire, en respectant **exactement** cette structure :

{{
  "steps": [
    {{
      "title": "Titre de l'étape",
      "description": "Description de l'étape",
      "exercises": [
        {{
          "title": "Titre de l'exercice",
          "description": "Courte description",
          "duration": 15,
          "type": "meditation",
          "instructions": [
            "Instruction 1",
            "Instruction 2",
            "Instruction 3"
          ],
          "animation_character": "🧘‍♀️",
          "recommended_videos": [
            "url 1",
            "url 2"
          ]
        }}
      ]
    }}
  ]
}}
Génère jusqu'à la fin
"""

    @classmethod
    def _parse_coaching_response(cls, response: str, coaching_type: str) -> List[Dict]:
        """Parse la réponse de l'IA et retourne les étapes"""

        try:
            # Extraire un JSON valide (avec un fallback si des caractères suivent)
            json_match = re.search(r"\{.*\}", response, re.DOTALL)
            if not json_match:
                raise ValueError("Aucun objet JSON détecté dans la réponse")

            json_str = json_match.group()

            try:
                parsed = json.loads(json_str)
            except json.JSONDecodeError as json_err:
                print(f"Erreur JSON invalide : {json_err}")
                raise ValueError("Impossible de parser la réponse IA")

            if "steps" not in parsed or not isinstance(parsed["steps"], list):
                raise ValueError(
                    "Structure de réponse invalide : clé 'steps' manquante ou incorrecte"
                )

            # Nettoyage et validation des étapes
            steps = []
            for i, step_data in enumerate(parsed["steps"][:4]):  # Max 4 étapes
                step = {
                    "title": step_data.get("title", f"Étape {i+1}"),
                    "description": step_data.get(
                        "description", "Description non disponible"
                    ),
                    "order": i + 1,
                    "exercises": [],
                }

                for j, exercise_data in enumerate(step_data.get("exercises", [])[:3]):
                    exercise = {
                        "title": exercise_data.get("title", f"Exercice {j+1}"),
                        "description": exercise_data.get(
                            "description", "Description non disponible"
                        ),
                        "duration": min(max(exercise_data.get("duration", 15), 5), 30),
                        "type": exercise_data.get("type", "practice"),
                        "instructions": exercise_data.get(
                            "instructions", ["Suivez les instructions à l'écran"]
                        ),
                        "animation_character": exercise_data.get(
                            "animation_character", "🤖"
                        ),
                        "recommended_videos": exercise_data.get(
                            "recommended_videos", []
                        ),
                    }
                    step["exercises"].append(exercise)

                steps.append(step)

            return steps

        except Exception as e:
            print(f"[⚠️] Erreur lors du parsing de la réponse IA : {str(e)}")
            return cls._get_default_coaching_path(coaching_type)

    @classmethod
    def _get_default_coaching_path(cls, coaching_type: str) -> List[Dict]:
        """Retourne un parcours par défaut en cas d'erreur"""

        default_paths = {
            "life": {
                "steps": [
                    {
                        "title": "Découverte de soi",
                        "description": "Explorez vos valeurs, forces et aspirations personnelles",
                        "order": 1,
                        "exercises": [
                            {
                                "title": "Cartographie des valeurs",
                                "description": "Identifiez et hiérarchisez vos valeurs fondamentales",
                                "duration": 20,
                                "type": "reflection",
                                "instructions": [
                                    "Listez 10 valeurs importantes pour vous",
                                    "Classez-les par ordre de priorité",
                                    "Réfléchissez à comment elles guident vos décisions",
                                ],
                                "animation_character": "🤔",
                                "recommended_videos": [
                                    "Les valeurs personnelles",
                                    "Découvrir ses priorités",
                                ],
                            },
                            {
                                "title": "Méditation de gratitude",
                                "description": "Cultivez la reconnaissance et la positivité",
                                "duration": 15,
                                "type": "meditation",
                                "instructions": [
                                    "Asseyez-vous confortablement",
                                    "Respirez profondément",
                                    "Pensez à 3 choses pour lesquelles vous êtes reconnaissant(e)",
                                ],
                                "animation_character": "🙏",
                                "recommended_videos": [
                                    "Méditation gratitude",
                                    "Pratique de la reconnaissance",
                                ],
                            },
                            {
                                "title": "Vision board personnel",
                                "description": "Créez une représentation visuelle de vos objectifs",
                                "duration": 25,
                                "type": "practice",
                                "instructions": [
                                    "Rassemblez des images qui représentent vos rêves",
                                    "Organisez-les sur un support",
                                    "Placez votre vision board dans un endroit visible",
                                ],
                                "animation_character": "🎨",
                                "recommended_videos": [
                                    "Créer un vision board",
                                    "Visualisation créative",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Gestion des émotions",
                        "description": "Apprenez à comprendre et gérer vos émotions",
                        "order": 2,
                        "exercises": [
                            {
                                "title": "Journal émotionnel",
                                "description": "Tenez un journal de vos émotions quotidiennes",
                                "duration": 15,
                                "type": "reflection",
                                "instructions": [
                                    "Notez vos émotions principales de la journée",
                                    "Identifiez les déclencheurs",
                                    "Réfléchissez aux patterns récurrents",
                                ],
                                "animation_character": "📝",
                                "recommended_videos": [
                                    "Journal émotionnel",
                                    "Comprendre ses émotions",
                                ],
                            },
                            {
                                "title": "Respiration apaisante",
                                "description": "Technique de respiration pour gérer le stress",
                                "duration": 10,
                                "type": "breathing",
                                "instructions": [
                                    "Inspirez pendant 4 secondes",
                                    "Retenez pendant 4 secondes",
                                    "Expirez pendant 6 secondes",
                                    "Répétez 10 fois",
                                ],
                                "animation_character": "🌬️",
                                "recommended_videos": [
                                    "Respiration anti-stress",
                                    "Techniques de relaxation",
                                ],
                            },
                            {
                                "title": "Ancrage positif",
                                "description": "Créez un ancrage pour retrouver un état positif",
                                "duration": 20,
                                "type": "practice",
                                "instructions": [
                                    "Rappelez-vous un moment de joie intense",
                                    "Revivez cette expérience en détail",
                                    "Créez un geste ou mot-clé pour y accéder",
                                ],
                                "animation_character": "⚓",
                                "recommended_videos": [
                                    "Ancrage PNL",
                                    "États ressources",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Relations interpersonnelles",
                        "description": "Améliorez vos relations avec les autres",
                        "order": 3,
                        "exercises": [
                            {
                                "title": "Analyse relationnelle",
                                "description": "Évaluez la qualité de vos relations importantes",
                                "duration": 25,
                                "type": "reflection",
                                "instructions": [
                                    "Listez vos 5 relations les plus importantes",
                                    "Évaluez la qualité de chaque relation",
                                    "Identifiez les améliorations possibles",
                                ],
                                "animation_character": "👥",
                                "recommended_videos": [
                                    "Relations saines",
                                    "Communication interpersonnelle",
                                ],
                            },
                            {
                                "title": "Écoute empathique",
                                "description": "Pratiquez l'écoute active et l'empathie",
                                "duration": 15,
                                "type": "practice",
                                "instructions": [
                                    "Choisissez une conversation importante",
                                    "Écoutez sans juger ni conseiller",
                                    "Reformulez ce que vous avez compris",
                                ],
                                "animation_character": "👂",
                                "recommended_videos": [
                                    "Écoute active",
                                    "Développer l'empathie",
                                ],
                            },
                            {
                                "title": "Méditation bienveillance",
                                "description": "Cultivez la bienveillance envers vous et les autres",
                                "duration": 18,
                                "type": "meditation",
                                "instructions": [
                                    "Commencez par vous envoyer de la bienveillance",
                                    "Étendez cette bienveillance à vos proches",
                                    "Incluez progressivement des personnes difficiles",
                                ],
                                "animation_character": "💝",
                                "recommended_videos": [
                                    "Méditation loving-kindness",
                                    "Compassion et bienveillance",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Réalisation personnelle",
                        "description": "Passez à l'action pour réaliser vos objectifs",
                        "order": 4,
                        "exercises": [
                            {
                                "title": "Plan d'action personnel",
                                "description": "Créez un plan concret pour vos objectifs",
                                "duration": 30,
                                "type": "practice",
                                "instructions": [
                                    "Définissez 3 objectifs prioritaires",
                                    "Décomposez chaque objectif en étapes",
                                    "Fixez des échéances réalistes",
                                ],
                                "animation_character": "📋",
                                "recommended_videos": [
                                    "Planification d'objectifs",
                                    "Méthode SMART",
                                ],
                            },
                            {
                                "title": "Visualisation de réussite",
                                "description": "Visualisez votre réussite future",
                                "duration": 20,
                                "type": "visualization",
                                "instructions": [
                                    "Imaginez-vous ayant atteint vos objectifs",
                                    "Ressentez les émotions de cette réussite",
                                    "Ancrez cette vision positive",
                                ],
                                "animation_character": "🌟",
                                "recommended_videos": [
                                    "Visualisation créatrice",
                                    "Loi d'attraction",
                                ],
                            },
                            {
                                "title": "Célébration des progrès",
                                "description": "Reconnaissez et célébrez vos avancées",
                                "duration": 15,
                                "type": "reflection",
                                "instructions": [
                                    "Listez tous vos progrès récents",
                                    "Reconnaissez vos efforts et persévérance",
                                    "Planifiez une récompense personnelle",
                                ],
                                "animation_character": "🎉",
                                "recommended_videos": [
                                    "Célébrer ses victoires",
                                    "Reconnaissance de soi",
                                ],
                            },
                        ],
                    },
                ]
            },
            "career": {
                "steps": [
                    {
                        "title": "Évaluation professionnelle",
                        "description": "Analysez votre situation actuelle et vos aspirations",
                        "order": 1,
                        "exercises": [
                            {
                                "title": "Bilan de compétences",
                                "description": "Identifiez vos forces et axes d'amélioration professionnels",
                                "duration": 30,
                                "type": "reflection",
                                "instructions": [
                                    "Listez vos compétences techniques et soft skills",
                                    "Évaluez votre niveau dans chaque domaine",
                                    "Identifiez les compétences à développer",
                                ],
                                "animation_character": "💼",
                                "recommended_videos": [
                                    "Bilan de compétences",
                                    "Développement professionnel",
                                ],
                            },
                            {
                                "title": "Méditation de confiance",
                                "description": "Renforcez votre confiance professionnelle",
                                "duration": 15,
                                "type": "meditation",
                                "instructions": [
                                    "Respirez calmement et profondément",
                                    "Visualisez vos succès professionnels passés",
                                    "Affirmez vos capacités et votre valeur",
                                ],
                                "animation_character": "💪",
                                "recommended_videos": [
                                    "Confiance en soi au travail",
                                    "Méditation pour leaders",
                                ],
                            },
                            {
                                "title": "Cartographie de carrière",
                                "description": "Explorez les différents chemins possibles",
                                "duration": 25,
                                "type": "practice",
                                "instructions": [
                                    "Dessinez votre parcours professionnel actuel",
                                    "Identifiez 3 directions possibles",
                                    "Évaluez les opportunités et défis de chaque voie",
                                ],
                                "animation_character": "🗺️",
                                "recommended_videos": [
                                    "Planification de carrière",
                                    "Évolution professionnelle",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Développement du leadership",
                        "description": "Cultivez vos compétences de leader",
                        "order": 2,
                        "exercises": [
                            {
                                "title": "Style de leadership",
                                "description": "Identifiez et développez votre style de leadership",
                                "duration": 20,
                                "type": "reflection",
                                "instructions": [
                                    "Analysez vos expériences de leadership",
                                    "Identifiez votre style naturel",
                                    "Définissez les aspects à améliorer",
                                ],
                                "animation_character": "👑",
                                "recommended_videos": [
                                    "Styles de leadership",
                                    "Leadership authentique",
                                ],
                            },
                            {
                                "title": "Communication assertive",
                                "description": "Pratiquez une communication claire et respectueuse",
                                "duration": 18,
                                "type": "practice",
                                "instructions": [
                                    "Identifiez une situation de communication difficile",
                                    "Préparez votre message avec la méthode DESC",
                                    "Entraînez-vous à exprimer vos besoins clairement",
                                ],
                                "animation_character": "🗣️",
                                "recommended_videos": [
                                    "Communication assertive",
                                    "Gestion des conflits",
                                ],
                            },
                            {
                                "title": "Vision inspirante",
                                "description": "Développez une vision motivante pour votre équipe",
                                "duration": 22,
                                "type": "visualization",
                                "instructions": [
                                    "Imaginez l'impact positif de votre leadership",
                                    "Définissez une vision claire et inspirante",
                                    "Pratiquez la communication de cette vision",
                                ],
                                "animation_character": "🔮",
                                "recommended_videos": [
                                    "Leadership visionnaire",
                                    "Inspiration d'équipe",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Networking et relations",
                        "description": "Construisez un réseau professionnel solide",
                        "order": 3,
                        "exercises": [
                            {
                                "title": "Audit de réseau",
                                "description": "Évaluez et cartographiez votre réseau professionnel",
                                "duration": 25,
                                "type": "reflection",
                                "instructions": [
                                    "Listez vos contacts professionnels importants",
                                    "Catégorisez-les par domaine et influence",
                                    "Identifiez les lacunes dans votre réseau",
                                ],
                                "animation_character": "🕸️",
                                "recommended_videos": [
                                    "Construire son réseau",
                                    "Networking efficace",
                                ],
                            },
                            {
                                "title": "Elevator pitch",
                                "description": "Créez une présentation percutante de votre profil",
                                "duration": 15,
                                "type": "practice",
                                "instructions": [
                                    "Résumez votre parcours en 30 secondes",
                                    "Mettez en avant votre valeur unique",
                                    "Entraînez-vous jusqu'à la fluidité",
                                ],
                                "animation_character": "🎯",
                                "recommended_videos": [
                                    "Elevator pitch parfait",
                                    "Se présenter efficacement",
                                ],
                            },
                            {
                                "title": "Stratégie relationnelle",
                                "description": "Planifiez vos actions de networking",
                                "duration": 20,
                                "type": "practice",
                                "instructions": [
                                    "Identifiez 5 personnes clés à rencontrer",
                                    "Planifiez comment les approcher",
                                    "Définissez votre valeur ajoutée pour elles",
                                ],
                                "animation_character": "🤝",
                                "recommended_videos": [
                                    "Stratégie de networking",
                                    "Relations professionnelles",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Réalisation des objectifs",
                        "description": "Concrétisez vos ambitions professionnelles",
                        "order": 4,
                        "exercises": [
                            {
                                "title": "Plan de carrière détaillé",
                                "description": "Créez une feuille de route précise pour votre évolution",
                                "duration": 30,
                                "type": "practice",
                                "instructions": [
                                    "Définissez votre objectif à 3 ans",
                                    "Identifiez les étapes intermédiaires",
                                    "Créez un plan d'action avec échéances",
                                ],
                                "animation_character": "📈",
                                "recommended_videos": [
                                    "Planification de carrière",
                                    "Objectifs professionnels",
                                ],
                            },
                            {
                                "title": "Gestion du changement",
                                "description": "Préparez-vous aux transitions professionnelles",
                                "duration": 20,
                                "type": "reflection",
                                "instructions": [
                                    "Identifiez vos résistances au changement",
                                    "Développez votre adaptabilité",
                                    "Créez un plan de gestion du stress",
                                ],
                                "animation_character": "🔄",
                                "recommended_videos": [
                                    "Gestion du changement",
                                    "Adaptabilité professionnelle",
                                ],
                            },
                            {
                                "title": "Célébration des succès",
                                "description": "Reconnaissez et valorisez vos accomplissements",
                                "duration": 15,
                                "type": "reflection",
                                "instructions": [
                                    "Documentez vos réussites récentes",
                                    "Analysez les facteurs de succès",
                                    "Planifiez comment capitaliser sur ces acquis",
                                ],
                                "animation_character": "🏆",
                                "recommended_videos": [
                                    "Valoriser ses succès",
                                    "Portfolio de réussites",
                                ],
                            },
                        ],
                    },
                ]
            },
            "health": {
                "steps": [
                    {
                        "title": "Fondations du bien-être",
                        "description": "Établissez les bases d'un mode de vie sain",
                        "order": 1,
                        "exercises": [
                            {
                                "title": "Bilan santé global",
                                "description": "Évaluez votre état de santé actuel dans tous les domaines",
                                "duration": 25,
                                "type": "reflection",
                                "instructions": [
                                    "Évaluez votre alimentation actuelle",
                                    "Analysez votre niveau d'activité physique",
                                    "Identifiez vos sources de stress et fatigue",
                                ],
                                "animation_character": "📊",
                                "recommended_videos": [
                                    "Bilan santé complet",
                                    "Évaluation bien-être",
                                ],
                            },
                            {
                                "title": "Respiration énergisante",
                                "description": "Apprenez une technique de respiration revitalisante",
                                "duration": 10,
                                "type": "breathing",
                                "instructions": [
                                    "Inspirez pendant 4 secondes par le nez",
                                    "Retenez pendant 4 secondes",
                                    "Expirez pendant 6 secondes par la bouche",
                                    "Répétez 10 cycles",
                                ],
                                "animation_character": "🌬️",
                                "recommended_videos": [
                                    "Respiration énergisante",
                                    "Techniques de souffle",
                                ],
                            },
                            {
                                "title": "Routine matinale santé",
                                "description": "Créez une routine matinale pour bien commencer la journée",
                                "duration": 20,
                                "type": "practice",
                                "instructions": [
                                    "Définissez 5 activités santé matinales",
                                    "Organisez-les dans un ordre logique",
                                    "Testez votre routine pendant une semaine",
                                ],
                                "animation_character": "☀️",
                                "recommended_videos": [
                                    "Routine matinale santé",
                                    "Habitudes du matin",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Nutrition consciente",
                        "description": "Développez une relation saine avec l'alimentation",
                        "order": 2,
                        "exercises": [
                            {
                                "title": "Journal alimentaire",
                                "description": "Tenez un journal détaillé de votre alimentation",
                                "duration": 15,
                                "type": "reflection",
                                "instructions": [
                                    "Notez tout ce que vous mangez pendant 3 jours",
                                    "Observez vos émotions liées à l'alimentation",
                                    "Identifiez vos patterns alimentaires",
                                ],
                                "animation_character": "📝",
                                "recommended_videos": [
                                    "Journal alimentaire",
                                    "Alimentation consciente",
                                ],
                            },
                            {
                                "title": "Méditation avant repas",
                                "description": "Pratiquez la pleine conscience avant de manger",
                                "duration": 8,
                                "type": "meditation",
                                "instructions": [
                                    "Observez votre nourriture avec tous vos sens",
                                    "Respirez profondément avant de commencer",
                                    "Mangez lentement en savourant chaque bouchée",
                                ],
                                "animation_character": "🧘‍♀️",
                                "recommended_videos": [
                                    "Méditation alimentaire",
                                    "Manger en pleine conscience",
                                ],
                            },
                            {
                                "title": "Planification des repas",
                                "description": "Organisez vos repas pour une semaine équilibrée",
                                "duration": 25,
                                "type": "practice",
                                "instructions": [
                                    "Planifiez 7 jours de repas équilibrés",
                                    "Préparez une liste de courses saine",
                                    "Organisez vos préparations à l'avance",
                                ],
                                "animation_character": "🍽️",
                                "recommended_videos": [
                                    "Meal prep santé",
                                    "Planification nutritionnelle",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Activité physique",
                        "description": "Intégrez le mouvement dans votre quotidien",
                        "order": 3,
                        "exercises": [
                            {
                                "title": "Programme d'exercices personnalisé",
                                "description": "Créez un programme adapté à vos besoins et contraintes",
                                "duration": 30,
                                "type": "practice",
                                "instructions": [
                                    "Évaluez votre niveau de forme actuel",
                                    "Choisissez 3 types d'activités qui vous plaisent",
                                    "Planifiez 4 séances par semaine",
                                ],
                                "animation_character": "💪",
                                "recommended_videos": [
                                    "Programme fitness débutant",
                                    "Exercices à domicile",
                                ],
                            },
                            {
                                "title": "Étirements quotidiens",
                                "description": "Routine d'étirements pour la flexibilité et détente",
                                "duration": 15,
                                "type": "practice",
                                "instructions": [
                                    "Étirez chaque groupe musculaire principal",
                                    "Maintenez chaque étirement 30 secondes",
                                    "Respirez profondément pendant les étirements",
                                ],
                                "animation_character": "🤸‍♀️",
                                "recommended_videos": [
                                    "Étirements quotidiens",
                                    "Flexibilité et mobilité",
                                ],
                            },
                            {
                                "title": "Marche méditative",
                                "description": "Combinez activité physique et méditation",
                                "duration": 20,
                                "type": "meditation",
                                "instructions": [
                                    "Marchez lentement en vous concentrant sur vos pas",
                                    "Observez votre environnement sans jugement",
                                    "Synchronisez votre respiration avec vos pas",
                                ],
                                "animation_character": "🚶‍♀️",
                                "recommended_videos": [
                                    "Marche méditative",
                                    "Méditation en mouvement",
                                ],
                            },
                        ],
                    },
                    {
                        "title": "Équilibre et récupération",
                        "description": "Optimisez votre récupération et gestion du stress",
                        "order": 4,
                        "exercises": [
                            {
                                "title": "Routine de sommeil",
                                "description": "Optimisez votre sommeil pour une meilleure récupération",
                                "duration": 20,
                                "type": "practice",
                                "instructions": [
                                    "Définissez des heures de coucher et lever fixes",
                                    "Créez un rituel de préparation au sommeil",
                                    "Optimisez votre environnement de sommeil",
                                ],
                                "animation_character": "😴",
                                "recommended_videos": [
                                    "Hygiène du sommeil",
                                    "Améliorer son sommeil",
                                ],
                            },
                            {
                                "title": "Gestion du stress",
                                "description": "Techniques pour réduire et gérer le stress quotidien",
                                "duration": 18,
                                "type": "meditation",
                                "instructions": [
                                    "Identifiez vos signaux de stress",
                                    "Pratiquez la relaxation progressive",
                                    "Développez des stratégies d'adaptation",
                                ],
                                "animation_character": "🧘‍♂️",
                                "recommended_videos": [
                                    "Gestion du stress",
                                    "Relaxation profonde",
                                ],
                            },
                            {
                                "title": "Bilan et ajustements",
                                "description": "Évaluez vos progrès et ajustez votre approche",
                                "duration": 25,
                                "type": "reflection",
                                "instructions": [
                                    "Mesurez vos progrès dans chaque domaine",
                                    "Identifiez ce qui fonctionne le mieux",
                                    "Ajustez votre plan pour les semaines suivantes",
                                ],
                                "animation_character": "📈",
                                "recommended_videos": [
                                    "Suivi des progrès santé",
                                    "Ajustement des habitudes",
                                ],
                            },
                        ],
                    },
                ]
            },
        }

        return default_paths.get(coaching_type, default_paths["life"])["steps"]

    @classmethod
    def generate_video_recommendations(
        cls, exercise_type: str, coaching_type: str
    ) -> List[str]:
        """Génère des recommandations de vidéos pour un exercice"""

        try:
            prompt = f"""
Recommande 3 titres de vidéos YouTube pertinentes pour un exercice de type "{exercise_type}" 
dans le contexte du {coaching_type}.

Réponds uniquement avec 3 titres de vidéos, un par ligne, sans numérotation.
"""

            response = requests.post(
                cls.BASE_URL,
                headers={
                    "Authorization": f"Bearer {settings.TOGETHER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "meta-llama/Llama-2-70b-chat-hf",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.5,
                    "max_tokens": 200,
                },
            )

            if response.status_code == 200:
                ai_response = response.json()
                content = ai_response["choices"][0]["message"]["content"]
                videos = [line.strip() for line in content.split("\n") if line.strip()]
                return videos[:3]

        except Exception as e:
            print(f"Erreur lors de la génération des recommandations: {str(e)}")

        # Recommandations par défaut
        default_videos = {
            "meditation": [
                "Méditation guidée pour débutants",
                "Techniques de pleine conscience",
                "Relaxation profonde et bien-être",
            ],
            "reflection": [
                "Questions de développement personnel",
                "Techniques d'introspection",
                "Journal de réflexion guidé",
            ],
            "practice": [
                "Exercices pratiques de coaching",
                "Mise en action de vos objectifs",
                "Techniques de changement d'habitudes",
            ],
            "breathing": [
                "Techniques de respiration thérapeutique",
                "Respiration pour la gestion du stress",
                "Exercices de souffle énergisant",
            ],
            "visualization": [
                "Visualisation créatrice guidée",
                "Techniques d'imagerie mentale",
                "Méditation de visualisation",
            ],
        }

        return default_videos.get(exercise_type, default_videos["practice"])
