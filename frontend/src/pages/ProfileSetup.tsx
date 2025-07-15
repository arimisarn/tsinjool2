import { useEffect, useState } from "react";
import {
  Brain,
  User,
  Briefcase,
  Heart,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import React from "react";

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

const coachingOptions: Record<
  CoachingType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  life: {
    label: "Coaching de vie",
    icon: <Heart className="w-5 h-5 text-pink-500" />,
    color: "from-pink-400 to-rose-500",
  },
  career: {
    label: "Coaching de carrière",
    icon: <Briefcase className="w-5 h-5 text-indigo-500" />,
    color: "from-blue-400 to-indigo-500",
  },
  health: {
    label: "Coaching santé",
    icon: <User className="w-5 h-5 text-green-500" />,
    color: "from-green-400 to-teal-500",
  },
};

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Erreur profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-700">
        Chargement...
      </div>
    );
  }

  if (!profile) return null;

  const { nom_utilisateur, email } = profile.user;
  const { label, icon, color } = coachingOptions[profile.coaching_type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Votre profil Tsinjool
            </h1>
          </div>
        </div>

        {/* Main Info */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center sm:w-1/3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
              <img
                src={profile.photo_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold mt-4">{nom_utilisateur}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          {/* Bio + Coaching */}
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Bio</h3>
              <p className="text-gray-800 bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm">
                {profile.bio || "Aucune bio renseignée."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                Type de coaching
              </h3>
              <div
                className={`inline-flex items-center gap-2 text-white font-medium px-4 py-2 rounded-full text-sm bg-gradient-to-r ${color}`}
              >
                {icon}
                {label}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            value="127"
            label="Séances réalisées"
            color="from-blue-400 to-cyan-500"
          />
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            value="4.9"
            label="Note moyenne"
            color="from-green-400 to-emerald-500"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6" />}
            value="3+"
            label="Années d'expérience"
            color="from-purple-400 to-pink-500"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${color} text-white rounded-xl p-6 shadow-lg flex flex-col items-center`}
    >
      <div className="mb-3">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}
