import { useEffect, useState } from "react";
import axios from "axios";
import { User, RefreshCw, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Profile {
  bio: string;
  coaching_type: "life" | "career" | "health";
  photo?: string | null;
  nom_utilisateur: string;
  email: string;
}

interface Evaluation {
  resultat_ia: string;
  created_at: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié.");

        const [profileRes, evalRes] = await Promise.all([
          axios.get("https://tsinjool-backend.onrender.com/api/profile/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("https://tsinjool-backend.onrender.com/api/evaluation/latest/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        setProfile(profileRes.data);
        setEvaluation(evalRes.data);
      } catch (e: any) {
        setError(
          e.response?.data?.detail ||
            e.message ||
            "Erreur lors du chargement des données."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 text-blue-600 font-semibold animate-pulse">
        Chargement du tableau de bord...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 text-red-600 font-semibold p-4 text-center">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-8">

        {/* Profil */}
        <div className="md:w-1/3 flex flex-col items-center gap-6 text-center">
          <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden shadow-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            {profile?.photo ? (
              <img
                src={profile.photo}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{profile?.nom_utilisateur}</h2>
          <p className="text-sm text-gray-600">{profile?.email}</p>
          <p className="mt-2 px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase tracking-wide select-none">
            {profile?.coaching_type === "life"
              ? "Coaching de vie"
              : profile?.coaching_type === "career"
              ? "Coaching de carrière"
              : "Coaching santé"}
          </p>

          <button
            onClick={() => navigate("/profile-setup")}
            className="mt-6 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition font-semibold"
            title="Modifier profil"
          >
            <Edit2 className="inline w-5 h-5 mr-2 -mt-1" />
            Modifier profil
          </button>
        </div>

        {/* Plan IA */}
        <div className="md:w-2/3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Votre plan IA personnalisé</h3>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
              title="Rafraîchir le plan IA"
            >
              <RefreshCw className="w-5 h-5" />
              Rafraîchir
            </button>
          </div>

          {evaluation?.resultat_ia ? (
            <pre className="bg-blue-50 p-6 rounded-3xl text-gray-900 whitespace-pre-wrap font-sans overflow-auto max-h-[400px]">
              {evaluation.resultat_ia}
            </pre>
          ) : (
            <p className="text-gray-600 italic">
              Aucun plan IA disponible. Veuillez compléter une évaluation.
            </p>
          )}

          <button
            onClick={() => navigate("/evaluation")}
            className="mt-6 self-start px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition font-semibold"
            title="Faire une nouvelle évaluation"
          >
            Nouvelle évaluation
          </button>
        </div>
      </div>
    </div>
  );
}
