"use client"

import { useState, useEffect } from "react"
import { Brain, ArrowLeft, ArrowRight, CheckCircle, MessageCircle } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"

interface Question {
  id: number
  text: string
  type: "multiple" | "scale" | "text"
  options?: string[]
}

const questionsData = {
  life: [
    {
      id: 1,
      text: "Quel est votre principal défi dans votre vie personnelle actuellement ?",
      type: "multiple" as const,
      options: [
        "Gestion du stress et de l'anxiété",
        "Équilibre vie professionnelle/personnelle",
        "Relations interpersonnelles",
        "Confiance en soi et estime de soi",
        "Gestion du temps et organisation",
      ],
    },
    {
      id: 2,
      text: "Sur une échelle de 1 à 10, comment évaluez-vous votre niveau de satisfaction actuel dans la vie ?",
      type: "scale" as const,
    },
    {
      id: 3,
      text: "Quels sont vos objectifs principaux pour les 6 prochains mois ?",
      type: "text" as const,
    },
    {
      id: 4,
      text: "Comment gérez-vous habituellement le stress ?",
      type: "multiple" as const,
      options: [
        "Sport et activité physique",
        "Méditation et relaxation",
        "Discussions avec des proches",
        "Activités créatives",
        "Je ne sais pas bien gérer le stress",
      ],
    },
    {
      id: 5,
      text: "Décrivez une situation récente où vous vous êtes senti(e) particulièrement accompli(e).",
      type: "text" as const,
    },
  ],
  career: [
    {
      id: 1,
      text: "Quel est votre principal défi professionnel actuellement ?",
      type: "multiple" as const,
      options: [
        "Évolution de carrière et promotion",
        "Développement de compétences",
        "Leadership et management",
        "Équilibre vie pro/perso",
        "Changement de secteur ou reconversion",
      ],
    },
    {
      id: 2,
      text: "Sur une échelle de 1 à 10, à quel point êtes-vous satisfait(e) de votre carrière actuelle ?",
      type: "scale" as const,
    },
    {
      id: 3,
      text: "Où vous voyez-vous professionnellement dans 3 ans ?",
      type: "text" as const,
    },
    {
      id: 4,
      text: "Quel type de leadership vous inspire le plus ?",
      type: "multiple" as const,
      options: [
        "Leadership transformationnel",
        "Leadership collaboratif",
        "Leadership visionnaire",
        "Leadership authentique",
        "Je ne sais pas encore",
      ],
    },
    {
      id: 5,
      text: "Décrivez votre plus grande réussite professionnelle récente.",
      type: "text" as const,
    },
  ],
  health: [
    {
      id: 1,
      text: "Quel est votre principal objectif de santé et bien-être ?",
      type: "multiple" as const,
      options: [
        "Perte de poids et forme physique",
        "Gestion du stress et santé mentale",
        "Amélioration du sommeil",
        "Nutrition et habitudes alimentaires",
        "Énergie et vitalité au quotidien",
      ],
    },
    {
      id: 2,
      text: "Sur une échelle de 1 à 10, comment évaluez-vous votre niveau d'énergie quotidien ?",
      type: "scale" as const,
    },
    {
      id: 3,
      text: "Quelles habitudes aimeriez-vous développer pour améliorer votre bien-être ?",
      type: "text" as const,
    },
    {
      id: 4,
      text: "Quelle est votre approche préférée pour rester en forme ?",
      type: "multiple" as const,
      options: [
        "Exercices en salle de sport",
        "Activités en plein air",
        "Sports d'équipe",
        "Yoga et méditation",
        "Je cherche encore ma méthode",
      ],
    },
    {
      id: 5,
      text: "Décrivez les obstacles qui vous empêchent d'atteindre vos objectifs de santé.",
      type: "text" as const,
    },
  ],
}

export default function Evaluation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [coachingType, setCoachingType] = useState<string>("")

  useEffect(() => {
    document.title = "Tsinjool - Évaluation personnalisée"

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Veuillez vous connecter.")
      navigate("/dashboard")
      return
    }

    const type = location.state?.coachingType
    if (!type) {
      toast.error("Type de coaching non spécifié.")
      navigate("/profile-setup")
      return
    }

    setCoachingType(type)
  }, [navigate, location.state])

  // const questions = questionsData[coachingType as keyof typeof questionsData] || []
  const questions: Question[] = questionsData[coachingType as keyof typeof questionsData] || []


  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    const currentQuestionData = questions[currentQuestion]
    if (!answers[currentQuestionData.id]) {
      toast.error("Veuillez répondre à cette question avant de continuer.")
      return
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const evaluationData = {
        coaching_type: coachingType,
        answers: answers,
        completed_at: new Date().toISOString(),
      }

      const response = await axios.post("https://tsinjool-backend.onrender.com/api/evaluation/", evaluationData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })

      toast.success("Évaluation terminée ! Génération de votre parcours...")
      navigate("/dashboard", {
        state: {
          coachingType,
          evaluationId: response.data.id,
        },
      })
    } catch (error: any) {
      console.error(error)
      toast.error("Erreur lors de l'enregistrement de l'évaluation.")
    } finally {
      setLoading(false)
    }
  }

  if (!questions.length) {
    return <div>Chargement...</div>
  }

  const currentQuestionData = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const hasAnswered = answers[currentQuestionData.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Évaluation personnalisée</h1>
                <p className="text-sm opacity-90">
                  Question {currentQuestion + 1} sur {questions.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <div className="text-sm opacity-90">Progression</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-600">Question {currentQuestion + 1}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestionData.text}</h2>
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            {currentQuestionData.type === "multiple" && (
              <div className="space-y-3">
                {currentQuestionData.options?.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      answers[currentQuestionData.id] === option
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionData.id}`}
                      value={option}
                      checked={answers[currentQuestionData.id] === option}
                      onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestionData.id] === option
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestionData.id] === option && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestionData.type === "scale" && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1 - Très insatisfait(e)</span>
                  <span>10 - Très satisfait(e)</span>
                </div>
                <div className="flex gap-2">
                  {[...Array(10)].map((_, index) => {
                    const value = (index + 1).toString()
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(currentQuestionData.id, value)}
                        className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all duration-200 ${
                          answers[currentQuestionData.id] === value
                            ? "border-purple-500 bg-purple-500 text-white"
                            : "border-gray-300 hover:border-purple-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {currentQuestionData.type === "text" && (
              <textarea
                value={answers[currentQuestionData.id] || ""}
                onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 outline-none resize-none"
                rows={4}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Précédent
            </button>

            <div className="flex-1" />

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswered || loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? "Génération du parcours..." : "Terminer l'évaluation"}
                <CheckCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
