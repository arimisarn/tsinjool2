"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, User, Briefcase, Heart, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

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
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du chargement du profil.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start gap-8 flex-wrap">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={profile.photo_url || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              {profile.user.nom_utilisateur}
            </h1>

            <p className="text-gray-600">
              <span className="font-medium">Email :</span> {profile.user.email}
            </p>

            <p className="text-gray-600 flex items-center gap-2">
              <span className="font-medium">Coaching :</span>{" "}
              {coachingIcon[profile.coaching_type]}
              {coachingTypeLabel[profile.coaching_type]}
            </p>

            <div>
              <p className="font-medium text-gray-700 mb-1">Bio :</p>
              <p className="text-gray-800">
                {profile.bio || "Aucune bio renseignée."}
              </p>
            </div>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => navigate("/profile-setup")}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
            >
              <Settings className="w-5 h-5" />
              Modifier mon profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
