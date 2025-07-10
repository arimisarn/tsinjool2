import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Brain, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  gradient: string;
}

interface FormData {
  email: string;
  nom_utilisateur: string;
  password: string;
  password2: string;
}

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    title: "Coaching personnalisé",
    subtitle: "Un accompagnement adapté à vos besoins et objectifs.",
    gradient: "from-blue-400 via-teal-400 to-green-500",
  },
  {
    image:
      "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&h=600&fit=crop",
    title: "Suivi intelligent",
    subtitle: "L'IA suit vos progrès et vous motive chaque jour.",
    gradient: "from-purple-400 via-pink-400 to-red-500",
  },
  {
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    title: "Atteignez vos objectifs",
    subtitle: "Avec un coach digital qui ne vous laisse jamais tomber.",
    gradient: "from-orange-400 via-yellow-400 to-green-500",
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://tsinjool-backend.onrender.com/api/register/",
        formData
      );
      console.log(res);

      sessionStorage.setItem("pendingUsername", formData.nom_utilisateur);
      sessionStorage.setItem("pendingEmail", formData.email);
      sessionStorage.setItem("pendingPassword", formData.password);

      toast.success("Inscription réussie ! Veuillez confirmer votre email.");

      navigate("/confirm-email", { state: { email: formData.email } });
    } catch (error: any) {
      const msg =
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.nom_utilisateur?.[0] ||
        error?.response?.data?.non_field_errors?.[0] ||
        "Erreur lors de l'inscription.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Carrousel auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Section formulaire */}
        <div className="w-full lg:w-1/2 flex flex-col relative">
          {/* Header avec logo et navigation */}
          <div className="flex justify-between items-center p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white transition-colors duration-300">
                  Tsinjool
                </h1>
                <p className="text-sm text-gray-300 transition-colors duration-300">
                  Votre coach personnel intelligent
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-500 hover:underline font-medium"
            >
              Déjà un compte ? Se connecter
            </button>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex-1 flex items-center justify-center p-6 lg:p-8"
          >
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  COMMENCEZ GRATUITEMENT
                </p>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Créer un nouveau compte
                  <span className="text-blue-500">.</span>
                </h1>
              </div>

              <div className="space-y-4">
                {/* Nom et email sur la même ligne */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="nom_utilisateur"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Nom d'utilisateur
                    </label>
                    <input
                      id="nom_utilisateur"
                      type="text"
                      name="nom_utilisateur"
                      value={formData.nom_utilisateur}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      placeholder="Michel"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      placeholder="michel.masiak@anywhere.co"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-xl bg-gray-800 focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label
                    htmlFor="password2"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password2"
                      type={showConfirmPassword ? "text" : "password"}
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-xl bg-gray-800 focus:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 transition-all duration-200 outline-none text-white placeholder-gray-400"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      aria-label={
                        showConfirmPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-all duration-200 font-medium group"
                  >
                    <ArrowLeft className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-x-1" />
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Chargement..." : "S'inscrire"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Section carrousel animé */}
        <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[300px] lg:min-h-full">
          {/* Container des slides */}
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                  index === current
                    ? "opacity-100 transform translate-x-0"
                    : index < current
                    ? "opacity-0 transform -translate-x-full"
                    : "opacity-0 transform translate-x-full"
                }`}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${slide.gradient} relative`}
                >
                  {/* Image de fond */}
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      backgroundBlendMode: "overlay",
                    }}
                  />

                  {/* Overlay décoratif */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Contenu du slide avec animation */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-white transition-all duration-1000 delay-300 ${
                      index === current
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform translate-y-8"
                    }`}
                  >
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
                      {slide.title}
                    </h3>
                    <p className="text-lg lg:text-xl font-light max-w-md">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Éléments décoratifs animés */}
                  <div
                    className={`absolute top-8 left-8 transition-all duration-1000 delay-500 ${
                      index === current
                        ? "opacity-60 transform scale-100"
                        : "opacity-0 transform scale-75"
                    }`}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full blur-sm"></div>
                  </div>

                  <div
                    className={`absolute top-1/4 right-12 transition-all duration-1000 delay-700 ${
                      index === current
                        ? "opacity-40 transform scale-100"
                        : "opacity-0 transform scale-75"
                    }`}
                  >
                    <div className="w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
                  </div>

                  <div
                    className={`absolute bottom-1/4 left-12 transition-all duration-1000 delay-900 ${
                      index === current
                        ? "opacity-50 transform scale-100"
                        : "opacity-0 transform scale-75"
                    }`}
                  >
                    <div className="w-20 h-20 bg-white/15 rounded-full blur-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de slide */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Slide ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Logo décoratif animé */}
          <div className="absolute bottom-8 right-8 z-10">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-2 bg-white/80 rounded-full transform rotate-45 transition-all duration-300 ${
                    current === i ? "scale-110 bg-white" : ""
                  }`}
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animation: current === i ? "pulse 2s infinite" : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
