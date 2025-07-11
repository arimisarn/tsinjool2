import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Brain, ArrowLeft, CheckCircle } from "lucide-react";
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

export default function Evaluation() {
  const navigate = useNavigate();
  const location = useLocation();
  const coachingType = location.state?.coachingType as CoachingType;

  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coachingType) {
      toast.error("Type de coaching manquant.");
      navigate("/profile-setup");
    } else {
      // Initialise les réponses vides
      setAnswers(new Array(questionBank[coachingType].length).fill(""));
    }
  }, [coachingType]);

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant.");

      const payload = {
        coaching_type: coachingType,
        answers: answers,
      };

      // Remplace cette URL par celle de ton backend réel
      await axios.post("https://tsinjool-backend.onrender.com/api/evaluation/", payload, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      toast.success("Évaluation soumise !");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      toast.error("Erreur lors de l'envoi des réponses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tsinjool</h1>
              <p className="text-sm text-gray-600">Évaluation initiale</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 sm:p-10 space-y-6 overflow-auto">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">ÉTAPE 3 SUR 3</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Répondez à ces questions</h2>
            <p className="text-sm text-gray-600">Ces réponses nous aideront à mieux vous accompagner.</p>
          </div>

          <div className="space-y-6">
            {questionBank[coachingType]?.map((question, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {index + 1}. {question}
                </label>
                <textarea
                  value={answers[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none resize-none"
                  rows={3}
                  required
                />
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? "Analyse en cours..." : "Terminer l'évaluation"}
              {!loading && <CheckCircle className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
