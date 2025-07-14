import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Brain, Mail, User, Quote } from "lucide-react";
import pic from "../assets/avatar.jpg";

type ProfileData = {
  bio: string;
  coaching_type: "life" | "career" | "health";
  photo_url: string | null;
};

type UserData = {
  email: string;
  nom_utilisateur: string;
};

const coachingLabels: Record<ProfileData["coaching_type"], string> = {
  life: "Coaching de vie",
  career: "Coaching de carrière",
  health: "Coaching santé",
};

const badgeColors: Record<ProfileData["coaching_type"], string> = {
  life: "bg-pink-100 text-pink-600",
  career: "bg-blue-100 text-blue-600",
  health: "bg-green-100 text-green-600",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Mon profil - Tsinjool";
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        return navigate("/login");
      }

      try {
        const [profileRes, userRes] = await Promise.all([
          axios.get("https://tsinjool-backend.onrender.com/api/profile/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("https://tsinjool-backend.onrender.com/api/user/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        setProfile(profileRes.data);
        setUser(userRes.data);
      } catch (err) {
        toast.error("Erreur lors du chargement du profil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500">Chargement...</span>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-red-500">Profil non disponible.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        {/* En-tête */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-sm text-gray-500">Tsinjool Coaching IA</p>
          </div>
        </div>

        {/* Infos */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <img
            src={profile.photo_url || pic}
            alt="Photo de profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
          />

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-semibold">{user.nom_utilisateur}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5" />
              <span className="text-sm">{user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Quote className="w-5 h-5" />
              <span className="text-sm">
                {profile.bio || "Pas encore de bio."}
              </span>
            </div>

            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  badgeColors[profile.coaching_type]
                }`}
              >
                {coachingLabels[profile.coaching_type]}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate("/profile-setup")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all"
          >
            Modifier le profil
          </button>
        </div>
      </div>
    </div>
  );
}
