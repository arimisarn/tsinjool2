import { useEffect, useState, type JSX } from "react";
import { Brain, LoaderCircle, User, Briefcase, Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type CoachingType = "life" | "career" | "health";

interface UserProfileData {
  bio: string;
  coaching_type: CoachingType;
  photo_url: string;
  user: {
    nom_utilisateur: string;
    email: string;
  };
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const coachingTypeLabel: Record<CoachingType, string> = {
    life: "Coaching de vie",
    career: "Coaching de carrière",
    health: "Coaching santé",
  };

  const coachingIcon: Record<CoachingType, JSX.Element> = {
    life: <Heart className="w-5 h-5 text-pink-500" />,
    career: <Briefcase className="w-5 h-5 text-indigo-500" />,
    health: <User className="w-5 h-5 text-green-500" />,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error: any) {
        toast.error("Erreur lors du chargement du profil.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={profile.photo_url || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {profile.user.nom_utilisateur}
          </h2>
          <p className="text-sm text-gray-500">{profile.user.email}</p>
        </div>

        <div className="text-left space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-600">Bio :</label>
            <p className="mt-1 text-gray-800">
              {profile.bio || "Aucune bio renseignée."}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Type de coaching :
            </label>
            <div className="mt-1 flex items-center gap-2 text-gray-800 font-medium">
              {coachingIcon[profile.coaching_type]}
              {coachingTypeLabel[profile.coaching_type]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
