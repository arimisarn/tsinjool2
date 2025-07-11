import { useEffect, useState } from "react";
import axios from "axios";
import { Brain, Loader, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Evaluation = {
  coaching_type: string;
  answers: string[];
  resultat_ia: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    axios
      .get("https://tsinjool-backend.onrender.com/api/evaluation/last/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setEvaluation(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de charger le tableau de bord.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 flex-col gap-2">
        <AlertTriangle className="w-8 h-8 text-yellow-500" />
        <p>Aucune évaluation disponible.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Votre tableau de bord</h1>
            <p className="text-sm text-gray-600 capitalize">{evaluation.coaching_type.replace("life", "Coaching de vie").replace("career", "Coaching de carrière").replace("health", "Coaching santé")}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Plan IA personnalisé</h2>
          <pre className="bg-gray-100 border border-gray-200 rounded-xl p-4 whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {evaluation.resultat_ia}
          </pre>

          <div>
            <h3 className="text-md font-semibold text-gray-800 mt-6 mb-2">Vos réponses :</h3>
            <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
              {evaluation.answers.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
