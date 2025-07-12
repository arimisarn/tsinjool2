// EvaluationPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/clients/QuestionCard";
import ProgressBar from "@/components/clients/ProgressBar";
import axios from "axios";

interface Question {
  id: string;
  question: string;
  type: string;
  required: boolean;
  placeholder?: string;
  domains?: Array<{ name: string; key: string }>;
}

interface AssessmentData {
  coaching_type: string;
  questions: Question[];
  total_questions: number;
}

export default function Evaluation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(
    null
  );
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  console.log(setLoading);

  useEffect(() => {
    const mockData: AssessmentData = {
      coaching_type: "life",
      questions: [
        {
          id: "q1",
          question: "Quels sont vos objectifs ?",
          type: "textarea",
          required: true,
          placeholder: "Écrivez vos objectifs ici...",
        },
        {
          id: "q2",
          question: "Évaluez ces domaines de vie",
          type: "scale_multiple",
          required: true,
          domains: [
            { name: "Santé", key: "health" },
            { name: "Carrière", key: "career" },
          ],
        },
      ],
      total_questions: 2,
    };
    setTimeout(() => setAssessmentData(mockData), 500);
  }, []);

  const handleResponseChange = (id: string, value: any) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (currentStep < (assessmentData?.questions.length || 0) - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token"); // ou "access_token" selon ton app
      if (!token) {
        throw new Error("Utilisateur non authentifié");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/assessment/submit/`,
        {
          coaching_type: assessmentData?.coaching_type,
          responses,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.data?.redirect_to_dashboard) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      // toast.error("Erreur lors de l'envoi de l'évaluation");
    }
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Chargement de l'évaluation...</div>
      </div>
    );
  }

  const question = assessmentData.questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="text-blue-600" />
            <h1 className="text-xl font-bold">Évaluation</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </button>
        </div>

        <ProgressBar
          current={currentStep + 1}
          total={assessmentData.questions.length}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {question.question}
            </h2>
            <QuestionCard
              question={question}
              value={responses[question.id]}
              onChange={(val) => handleResponseChange(question.id, val)}
            />
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 inline" /> Précédent
          </button>
          {currentStep < assessmentData.questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={question.required && !responses[question.id]}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Suivant <ArrowRight className="w-4 h-4 inline" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                (question.required && !responses[question.id]) || loading
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? (
                "Analyse..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 inline" /> Terminer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
