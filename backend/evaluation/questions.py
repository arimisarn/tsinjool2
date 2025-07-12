# questions.py (nouveau fichier)
ASSESSMENT_QUESTIONS = {
    'life': [
        {
            'id': 'life_1',
            'question': 'Quels sont vos principaux objectifs personnels pour les 12 prochains mois ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez vos objectifs principaux...'
        },
        {
            'id': 'life_2',
            'question': 'Sur une échelle de 1 à 10, comment évaluez-vous votre satisfaction dans ces domaines ?',
            'type': 'scale_multiple',
            'required': True,
            'domains': [
                {'name': 'Relations personnelles', 'key': 'relations'},
                {'name': 'Situation financière', 'key': 'finances'},
                {'name': 'Développement personnel', 'key': 'development'},
                {'name': 'Loisirs et détente', 'key': 'leisure'}
            ]
        },
        {
            'id': 'life_3',
            'question': 'Quelles sont vos principales sources de stress actuellement ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez ce qui vous stresse le plus...'
        },
        {
            'id': 'life_4',
            'question': 'Comment gérez-vous habituellement les défis ou obstacles ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez votre approche face aux difficultés...'
        },
        {
            'id': 'life_5',
            'question': 'Quelles habitudes aimeriez-vous développer ou abandonner ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Listez les habitudes à changer...'
        }
    ],
    
    'career': [
        {
            'id': 'career_1',
            'question': 'Où vous voyez-vous professionnellement dans 3-5 ans ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez votre vision professionnelle...'
        },
        {
            'id': 'career_2',
            'question': 'Quelles sont vos principales compétences professionnelles ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Listez vos compétences clés...'
        },
        {
            'id': 'career_3',
            'question': 'Quel est votre niveau de satisfaction professionnelle actuel ?',
            'type': 'scale',
            'required': True,
            'min': 1,
            'max': 10,
            'label': 'Satisfaction (1-10)'
        },
        {
            'id': 'career_4',
            'question': 'Quels défis rencontrez-vous actuellement dans votre travail ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez vos défis professionnels...'
        },
        {
            'id': 'career_5',
            'question': 'Préférez-vous travailler en équipe ou en autonomie ?',
            'type': 'radio',
            'required': True,
            'options': [
                {'value': 'team', 'label': 'En équipe'},
                {'value': 'autonomous', 'label': 'En autonomie'},
                {'value': 'both', 'label': 'Les deux selon le contexte'}
            ]
        }
    ],
    
    'health': [
        {
            'id': 'health_1',
            'question': 'Quels sont vos principaux objectifs de santé/bien-être ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez vos objectifs santé...'
        },
        {
            'id': 'health_2',
            'question': 'Comment décririez-vous votre niveau d\'activité physique actuel ?',
            'type': 'radio',
            'required': True,
            'options': [
                {'value': 'sedentary', 'label': 'Sédentaire (peu ou pas d\'exercice)'},
                {'value': 'light', 'label': 'Légèrement actif (1-3 fois/semaine)'},
                {'value': 'moderate', 'label': 'Modérément actif (3-5 fois/semaine)'},
                {'value': 'very_active', 'label': 'Très actif (6+ fois/semaine)'}
            ]
        },
        {
            'id': 'health_3',
            'question': 'Combien d\'heures dormez-vous en moyenne par nuit ?',
            'type': 'number',
            'required': True,
            'min': 1,
            'max': 24,
            'label': 'Heures de sommeil'
        },
        {
            'id': 'health_4',
            'question': 'Comment gérez-vous le stress et la fatigue ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Décrivez vos méthodes de gestion du stress...'
        },
        {
            'id': 'health_5',
            'question': 'Quels obstacles vous empêchent d\'atteindre vos objectifs santé ?',
            'type': 'textarea',
            'required': True,
            'placeholder': 'Listez les obstacles principaux...'
        }
    ]
}