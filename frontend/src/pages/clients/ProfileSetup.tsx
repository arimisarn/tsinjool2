import React, { useState } from "react";
import { Brain, Camera, ArrowLeft, User, Briefcase, Heart, CheckCircle } from "lucide-react";

export default function ProfileSetup() {
  const [bio, setBio] = useState("");
  const [coachingType, setCoachingType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachingType) {
      alert("Veuillez sélectionner un type de coaching.");
      return;
    }

    setLoading(true);
    
    try {
      // Simulation de l'appel API avec utilisation de photo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      if (photo) {
        console.log("Photo uploadée:", photo.name, photo.size, "bytes");
        // Ici on pourrait traiter le fichier photo
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("bio", bio);
        formData.append("coachingType", coachingType);
        
        console.log("Données du formulaire prêtes à être envoyées");
      }
      
      alert("Profil mis à jour avec succès !");
      
      // Simulation navigation
      console.log("Navigation vers /dashboard");
    } catch (error) {
      alert("Erreur lors de l'enregistrement du profil.");
    } finally {
      setLoading(false);
    }
  };

  const coachingOptions = [
    {
      value: "life",
      label: "Coaching de vie",
      description: "Développement personnel et équilibre de vie",
      icon: <Heart className="w-5 h-5" />,
      gradient: "from-pink-400 to-rose-500"
    },
    {
      value: "career",
      label: "Coaching de carrière",
      description: "Évolution professionnelle et leadership",
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      value: "health",
      label: "Coaching santé",
      description: "Bien-être physique et mental",
      icon: <User className="w-5 h-5" />,
      gradient: "from-green-400 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Section formulaire */}
        <div className="w-full lg:w-3/5 flex flex-col relative">
          {/* Header avec logo */}
          <div className="flex justify-between items-center p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Tsinjool
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Votre coach personnel intelligent
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-md">
              <div className="mb-6 sm:mb-8">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  ÉTAPE 2 SUR 2
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Configurez votre profil
                  <span className="text-purple-500">.</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Personnalisez votre expérience de coaching
                </p>
              </div>

              <div className="space-y-6">
                {/* Photo de profil */}
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      )}
                    </div>
                    
                    {/* Bouton d'upload stylisé */}
                    <label className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 transform hover:scale-110">
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
                    Cliquez sur l'icône pour ajouter une photo
                  </p>
                  {photo && (
                    <p className="text-xs text-blue-600 font-medium">
                      Photo sélectionnée: {photo.name}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Présentez-vous
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parlez-nous de vous, vos objectifs, vos motivations..."
                    className="w-full h-20 sm:h-24 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none resize-none text-sm sm:text-base"
                    rows={3}
                  />
                </div>

                {/* Type de coaching */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type de coaching souhaité
                  </label>
                  <div className="space-y-2 sm:space-y-3">
                    {coachingOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <input
                          type="radio"
                          id={option.value}
                          name="coachingType"
                          value={option.value}
                          checked={coachingType === option.value}
                          onChange={(e) => setCoachingType(e.target.value)}
                          className="sr-only"
                        />
                        <label
                          htmlFor={option.value}
                          className={`flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            coachingType === option.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white mr-3 sm:mr-4 flex-shrink-0`}>
                            {React.cloneElement(option.icon, { 
                              className: "w-4 h-4 sm:w-5 sm:h-5" 
                            })}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {option.label}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate sm:whitespace-normal">
                              {option.description}
                            </p>
                          </div>
                          {coachingType === option.value && (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-3 px-4 sm:px-6 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium group order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="text-sm sm:text-base">Retour</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 sm:px-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 order-1 sm:order-2"
                    onClick={handleSubmit}
                  >
                    <span className="text-sm sm:text-base">
                      {loading ? "Enregistrement..." : "Terminer la configuration"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section décorative */}
        <div className="w-full lg:w-2/5 relative overflow-hidden min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 relative">
            {/* Image de fond */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop)`,
              }}
            />

            {/* Overlay décoratif */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Contenu */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 text-white">
              <div className="mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  Presque terminé !
                </h3>
                <p className="text-base sm:text-lg font-light max-w-sm">
                  Quelques informations pour personnaliser votre parcours de coaching
                </p>
              </div>

              {/* Étapes */}
              <div className="flex items-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Inscription</span>
                </div>
                <div className="w-4 sm:w-8 h-0.5 bg-white/30"></div>
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-purple-500 font-bold text-xs sm:text-sm">2</span>
                  </div>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">Profil</span>
                </div>
              </div>
            </div>

            {/* Éléments décoratifs animés */}
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute top-1/4 right-6 sm:right-12 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-300"></div>
            <div className="absolute bottom-1/4 left-6 sm:left-12 w-14 h-14 sm:w-20 sm:h-20 bg-white/15 rounded-full blur-md animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}