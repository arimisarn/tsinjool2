import React, { useState, useEffect } from "react";
import {
  Brain,
  Camera,
  ArrowLeft,
  User,
  Briefcase,
  Heart,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

type CoachingType = "life" | "career" | "health";

export default function ProfileSetup() {
  useEffect(() => {
    document.title = "Tsinjool - Configuration de profil";
  }, []);

  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [coachingType, setCoachingType] = useState<CoachingType | "">("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const coachingOptions: {
    value: CoachingType;
    label: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
  }[] = [
    {
      value: "life",
      label: "Coaching de vie",
      description: "Développement personnel et équilibre de vie",
      icon: <Heart className="w-5 h-5" />,
      gradient: "from-pink-400 to-rose-500",
    },
    {
      value: "career",
      label: "Coaching de carrière",
      description: "Évolution professionnelle et leadership",
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "from-blue-400 to-indigo-500",
    },
    {
      value: "health",
      label: "Coaching santé",
      description: "Bien-être physique et mental",
      icon: <User className="w-5 h-5" />,
      gradient: "from-green-400 to-teal-500",
    },
  ];

  // Vérifie la présence du token dès le chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Veuillez vous connecter.");
      navigate("/login");
    }
  }, [navigate]);

  // Met à jour le preview à chaque changement de photo
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    // Cleanup à chaque changement pour éviter fuite mémoire
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachingType) {
      toast.error("Veuillez sélectionner un type de coaching.");
      return;
    }

    if (bio.length > 500) {
      toast.error("La bio ne doit pas dépasser 500 caractères.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("coaching_type", coachingType);
    if (photo) formData.append("photo", photo);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant.");

      const response = await axios.put(
        "https://tsinjool-backend.onrender.com/api/profile/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            // Laisse axios gérer le content-type multipart/form-data
          },
        }
      );
      console.log(response);

      toast.success("Profil mis à jour avec succès !");
      navigate("/evaluation", { state: { coachingType } });
    } catch (error: any) {
      console.error(error);

      const errData = error?.response?.data;
      toast.error(
        errData?.detail ||
          errData?.coaching_type?.[0] ||
          errData?.photo?.[0] ||
          "Erreur lors de l’enregistrement du profil."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* SECTION FORMULAIRE */}
        <div className="w-full lg:w-3/5 flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tsinjool</h1>
                <p className="text-sm text-gray-600">
                  Coach personnel intelligent
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  ÉTAPE 2 SUR 2
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Configurez votre profil
                  <span className="text-purple-500">.</span>
                </h1>
                <p className="text-sm text-gray-600">
                  Personnalisez votre expérience de coaching
                </p>
              </div>

              {/* PHOTO DE PROFIL */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Aperçu"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <label
                    aria-label="Téléverser une photo de profil"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-110"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {photo && (
                  <p className="text-xs text-blue-600 font-medium">
                    Photo sélectionnée: {photo.name}
                  </p>
                )}
              </div>

              {/* BIO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Présentez-vous
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Vos objectifs, motivations..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{bio.length} / 500</p>
              </div>

              {/* TYPE DE COACHING */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de coaching souhaité
                </label>
                <div className="space-y-2">
                  {coachingOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={option.value}
                        name="coachingType"
                        value={option.value}
                        checked={coachingType === option.value}
                        onChange={(e) =>
                          setCoachingType(e.target.value as CoachingType)
                        }
                        className="sr-only"
                      />
                      <label
                        htmlFor={option.value}
                        className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          coachingType === option.value
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white mr-4`}
                        >
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {option.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {option.description}
                          </p>
                        </div>
                        {coachingType === option.value && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOUTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition duration-200"
                  disabled={loading}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? "Enregistrement..." : "Terminer la configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* SECTION DÉCORATIVE */}
        <div className="w-full lg:w-2/5 relative overflow-hidden min-h-[300px] lg:min-h-full">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 relative">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Presque terminé !</h3>
              <p className="text-base font-light max-w-sm">
                Quelques informations pour personnaliser votre parcours
              </p>
            </div>

            {/* Animations */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-white/10 rounded-full blur-sm animate-pulse" />
            <div className="absolute top-1/4 right-10 w-16 h-16 bg-white/5 rounded-full blur-lg animate-pulse delay-300" />
            <div className="absolute bottom-1/4 left-10 w-14 h-14 bg-white/15 rounded-full blur-md animate-pulse delay-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
