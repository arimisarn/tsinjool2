import { useEffect, useState, type JSX } from "react";
import {
  Brain,
  LoaderCircle,
  User,
  Briefcase,
  Heart,
  Edit3,
  Camera,
  Save,
  X,
  Mail,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nom_utilisateur: "",
    bio: "",
    coaching_type: "life" as CoachingType,
    photo_url: "",
  });

  const coachingTypeLabel: Record<CoachingType, string> = {
    life: "Coaching de vie",
    career: "Coaching de carrière",
    health: "Coaching santé",
  };

  const coachingIcon: Record<CoachingType, JSX.Element> = {
    life: <Heart className="w-6 h-6 text-pink-500" />,
    career: <Briefcase className="w-6 h-6 text-indigo-500" />,
    health: <User className="w-6 h-6 text-green-500" />,
  };

  const coachingGradient: Record<CoachingType, string> = {
    life: "from-pink-500 via-rose-500 to-red-500",
    career: "from-indigo-500 via-purple-500 to-blue-500",
    health: "from-green-500 via-emerald-500 to-teal-500",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
        setEditForm({
          nom_utilisateur: data.user.nom_utilisateur,
          bio: data.bio,
          coaching_type: data.coaching_type,
          photo_url: data.photo_url,
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://tsinjool-backend.onrender.com/api/profile/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            bio: editForm.bio,
            coaching_type: editForm.coaching_type,
            photo_url: editForm.photo_url,
            nom_utilisateur: editForm.nom_utilisateur,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        nom_utilisateur: profile.user.nom_utilisateur,
        bio: profile.bio,
        coaching_type: profile.coaching_type,
        photo_url: profile.photo_url,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-300 animate-ping"></div>
          </div>
          <div className="text-center">
            <LoaderCircle className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white/80 text-lg font-medium">
              Chargement de votre profil...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div
        className={`relative h-80 bg-gradient-to-r ${
          coachingGradient[profile.coaching_type]
        } flex items-center justify-center`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>

        {/* Edit Button */}
        <div className="absolute top-6 right-6 z-10">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm rounded-full p-3 text-white hover:scale-110 shadow-lg"
            >
              <Edit3 className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-green-500/80 hover:bg-green-500 transition-all duration-300 backdrop-blur-sm rounded-full p-3 text-white hover:scale-110 shadow-lg"
              >
                <Save className="w-6 h-6" />
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500/80 hover:bg-red-500 transition-all duration-300 backdrop-blur-sm rounded-full p-3 text-white hover:scale-110 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div className="relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-white/10 backdrop-blur-sm">
              <img
                src={
                  isEditing
                    ? editForm.photo_url
                    : profile.photo_url || "/default-avatar.png"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-20 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* User Info Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 mb-8 shadow-2xl">
            <div className="text-center mb-8">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.nom_utilisateur}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      nom_utilisateur: e.target.value,
                    })
                  }
                  className="text-3xl font-bold text-white bg-transparent border-b-2 border-white/30 focus:border-white/60 outline-none text-center px-4 py-2 mb-4"
                  placeholder="Votre nom"
                />
              ) : (
                <h1 className="text-4xl font-bold text-white mb-4">
                  {profile.user.nom_utilisateur}
                </h1>
              )}

              <div className="flex items-center justify-center gap-2 text-white/80 mb-6">
                <Mail className="w-5 h-5" />
                <span className="text-lg">{profile.user.email}</span>
              </div>

              {/* Coaching Type Badge */}
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                {
                  coachingIcon[
                    isEditing ? editForm.coaching_type : profile.coaching_type
                  ]
                }
                {isEditing ? (
                  <select
                    value={editForm.coaching_type}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        coaching_type: e.target.value as CoachingType,
                      })
                    }
                    className="bg-transparent border-0 outline-none text-white font-medium"
                  >
                    <option value="life" className="text-black">
                      Coaching de vie
                    </option>
                    <option value="career" className="text-black">
                      Coaching de carrière
                    </option>
                    <option value="health" className="text-black">
                      Coaching santé
                    </option>
                  </select>
                ) : (
                  <span className="font-medium text-lg">
                    {coachingTypeLabel[profile.coaching_type]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 mb-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">À propos</h2>
            </div>

            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                className="w-full h-40 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 outline-none resize-none text-white placeholder-white/50 text-lg leading-relaxed"
                placeholder="Parlez-nous de vous, votre expérience, vos spécialités..."
              />
            ) : (
              <p className="text-white/90 text-lg leading-relaxed">
                {profile.bio || "Aucune bio renseignée."}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">127</div>
              <div className="text-white/70">Séances réalisées</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">4.9</div>
              <div className="text-white/70">Note moyenne</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center shadow-xl">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">3+</div>
              <div className="text-white/70">Années d'expérience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
