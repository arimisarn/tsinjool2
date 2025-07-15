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
  Sparkles,
  Star,
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
  useEffect(() => {
    document.title = "Tsinjool - Profil";
  }, []);
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
    life: <Heart className="w-5 h-5 text-pink-500" />,
    career: <Briefcase className="w-5 h-5 text-indigo-500" />,
    health: <User className="w-5 h-5 text-green-500" />,
  };

  const coachingGradient: Record<CoachingType, string> = {
    life: "from-pink-500 to-rose-500",
    career: "from-indigo-500 to-purple-500",
    health: "from-green-500 to-emerald-500",
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // toast.error("Veuillez vous connecter.");
        // navigate("/login");
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
        // toast.error("Erreur lors du chargement du profil.");
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
      // toast.success("Profil mis à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      // toast.error("Erreur lors de la mise à jour du profil.");
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <LoaderCircle className="absolute inset-0 w-16 h-16 animate-spin text-purple-500" />
          </div>
          <p className="text-gray-600 font-medium">
            Chargement de votre profil...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-pink-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-indigo-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mon Profil
            </h1>
          </div>
          <p className="text-gray-600">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div> */}

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Cover Background */}
          <div
            className={`h-32 bg-gradient-to-r ${
              coachingGradient[profile.coaching_type]
            } relative`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm rounded-full p-2 text-white hover:scale-105"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500/80 hover:bg-green-500 transition-all duration-200 backdrop-blur-sm rounded-full p-2 text-white hover:scale-105"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500/80 hover:bg-red-500 transition-all duration-200 backdrop-blur-sm rounded-full p-2 text-white hover:scale-105"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pb-8">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col items-center -mt-16 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
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
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
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
                    className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-purple-300 focus:border-purple-500 outline-none text-center px-2 py-1"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profile.user.nom_utilisateur}
                  </h2>
                )}

                <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.user.email}</span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bio Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    À propos
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className="w-full h-32 bg-transparent border-0 outline-none resize-none text-gray-700 placeholder-gray-400"
                      placeholder="Parlez-nous de vous..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {profile.bio || "Aucune bio renseignée."}
                    </p>
                  )}
                </div>
              </div>

              {/* Coaching Type Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Spécialité
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  {isEditing ? (
                    <select
                      value={editForm.coaching_type}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          coaching_type: e.target.value as CoachingType,
                        })
                      }
                      className="w-full bg-transparent border-0 outline-none text-gray-700 font-medium"
                    >
                      <option value="life">Coaching de vie</option>
                      <option value="career">Coaching de carrière</option>
                      <option value="health">Coaching santé</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3">
                      {coachingIcon[profile.coaching_type]}
                      <span className="text-gray-700 font-medium">
                        {coachingTypeLabel[profile.coaching_type]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">127</div>
                <div className="text-sm text-gray-600">Séances</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">4.9</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">3+</div>
                <div className="text-sm text-gray-600">Années</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
