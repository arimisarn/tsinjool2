import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type CoachingType = "life" | "career" | "health";

const questionBank: Record<CoachingType, string[]> = {
  life: [
    "Qu’est-ce qui vous motive le plus en ce moment ?",
    "Quels domaines de votre vie souhaitez-vous améliorer ?",
    "Avez-vous des habitudes que vous voulez changer ?",
    "Comment évaluez-vous votre équilibre vie perso/pro ?",
    "Quels sont les plus grands obstacles que vous rencontrez ?",
  ],
  career: [
    "Êtes-vous satisfait de votre situation professionnelle actuelle ?",
    "Quels sont vos objectifs de carrière à 2-5 ans ?",
    "Quelles sont vos plus grandes forces au travail ?",
    "Quelles difficultés rencontrez-vous dans votre carrière ?",
    "Quel rôle rêvez-vous d’occuper un jour ?",
  ],
  health: [
    "Comment évaluez-vous votre santé physique actuelle ?",
    "Avez-vous une routine sportive ?",
    "Avez-vous un sommeil réparateur ?",
    "Suivez-vous une alimentation spécifique ?",
    "Ressentez-vous souvent du stress ?",
  ],
};

interface EvaluationSliderProps {
  questions: string[];
  onSubmit: (answers: string[]) => void;
  loading: boolean;
}

function EvaluationSlider({ questions, onSubmit, loading }: EvaluationSliderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""));
  const [animating, setAnimating] = useState(false);

  const isValid = (answer: string) => answer.trim().length >= 3;

  const handleChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const goToStep = (newStep: number) => {
    if (animating) return;
    if (newStep < 0 || newStep >= questions.length) return;

    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setAnimating(false);
    }, 300);
  };

  const handleNext = () => {
    if (!isValid(answers[currentStep])) return;
    if (currentStep < questions.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onSubmit(answers);
    }
  };

  const handlePrev = () => {
    goToStep(currentStep - 1);
  };

  const progressPercent = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-purple-600 to-blue-700 rounded-3xl shadow-2xl text-white font-sans select-none">
      <div className="w-full bg-purple-900 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="h-2 bg-blue-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className={`relative h-32 mb-8 overflow-hidden`}>
        {questions.map((q, i) => (
          <div
            key={i}
            aria-hidden={i !== currentStep}
            className={`absolute inset-0 transition-all duration-300 ease-in-out
              ${i === currentStep ? "opacity-100 translate-x-0" : i < currentStep ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"}
            `}
          >
            <h2 className="text-xl font-bold mb-2">{`Question ${i + 1} / ${questions.length}`}</h2>
            <p className="text-sm opacity-90">{q}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Votre réponse ici..."
        className="w-full p-3 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-300"
        value={answers[currentStep]}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleNext(); }}
        disabled={loading || animating}
        autoFocus
      />

      {!isValid(answers[currentStep]) && (
        <p className="mt-1 text-xs text-red-300 italic">
          La réponse doit contenir au moins 3 caractères.
        </p>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0 || loading || animating}
          className={`px-6 py-2 rounded-xl font-semibold transition
            ${currentStep === 0 || loading || animating
              ? "bg-purple-300/40 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"}
          `}
        >
          Précédent
        </button>

        <button
          onClick={handleNext}
          disabled={!isValid(answers[currentStep]) || loading || animating}
          className="px-6 py-2 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === questions.length - 1 ? "Terminer" : "Suivant"}
        </button>
      </div>
    </div>
  );
}

interface EvaluationPageProps {
  coachingType: CoachingType;
}

export default function EvaluationPage({ coachingType }: EvaluationPageProps) {
  const questions = questionBank[coachingType];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (answers: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Utilisateur non authentifié.");

      const responses = questions.reduce((acc, question, i) => {
        acc[`q${i + 1}`] = answers[i];
        console.log(question);
        return acc;
      }, {} as Record<string, string>);
     
      const response = await axios.post(
        "https://tsinjool-backend.onrender.com/api/assessment/submit/",
        {
          coaching_type: coachingType,
          responses,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.data.redirect_to_dashboard) {
        navigate("/dashboard");
      } else {
        console.warn("Redirection non signalée, mais l’évaluation est enregistrée.");
      }
    } catch (e: any) {
      setError(
        e.response?.data?.detail ||
        e.response?.data?.error ||
        e.message ||
        "Erreur lors de l’envoi de l’évaluation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <EvaluationSlider questions={questions} onSubmit={handleSubmit} loading={loading} />

      {loading && (
        <p className="mt-6 text-blue-600 font-semibold animate-pulse">
          Analyse en cours, veuillez patienter...
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-600 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
