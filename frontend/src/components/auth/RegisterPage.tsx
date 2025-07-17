import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logoRond.png";

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
  useEffect(() => {
    document.title = "Tsinjool - Inscription";
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Section formulaire */}
        <div className="w-full lg:w-1/2 flex flex-col relative px-6 py-8 sm:px-10 sm:py-12">
          {/* Header avec logo et navigation */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Tsinjool
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-300 transition-colors duration-300">
                  Votre coach personnel intelligent
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              Déjà un compte ? Se connecter
            </button>
          </div>

          {/* Formulaire */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex-1 flex flex-col justify-center"
          >
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                  COMMENCEZ GRATUITEMENT
                </p>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                  Créer un nouveau compte
                  <span className="text-blue-600 dark:text-blue-400">.</span>
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom d'utilisateur */}
                <div>
                  <label
                    htmlFor="nom_utilisateur"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Nom d'utilisateur
                  </label>
                  <input
                    id="nom_utilisateur"
                    name="nom_utilisateur"
                    type="text"
                    value={formData.nom_utilisateur}
                    onChange={handleChange}
                    placeholder="Michel"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="michel.masiak@anywhere.co"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password2"
                    name="password2"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
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
              <div className="flex gap-3 pt-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-400 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold w-full sm:w-auto"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {loading ? "Chargement..." : "S'inscrire"}
                </button>
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
                    ? "opacity-100 translate-x-0"
                    : index < current
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0"
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

                  {/* Overlays décoratifs */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Contenu du slide */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12 text-white transition-all duration-1000 delay-300 ${
                      index === current
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    <h3 className="text-3xl sm:text-4xl font-bold mb-4 drop-shadow-lg">
                      {slide.title}
                    </h3>
                    <p className="text-lg sm:text-xl font-light max-w-md">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Décorations animées */}
                  <div
                    className={`absolute top-8 left-8 rounded-full bg-white/20 blur-sm w-16 h-16 transition-all duration-1000 delay-500 ${
                      index === current
                        ? "opacity-60 scale-100"
                        : "opacity-0 scale-75"
                    }`}
                  />
                  <div
                    className={`absolute top-1/4 right-12 rounded-full bg-white/10 blur-lg w-24 h-24 transition-all duration-1000 delay-700 ${
                      index === current
                        ? "opacity-40 scale-100"
                        : "opacity-0 scale-75"
                    }`}
                  />
                  <div
                    className={`absolute bottom-1/4 left-12 rounded-full bg-white/15 blur-md w-20 h-20 transition-all duration-1000 delay-900 ${
                      index === current
                        ? "opacity-50 scale-100"
                        : "opacity-0 scale-75"
                    }`}
                  />
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
                className={`w-3 h-3 rounded-full transition-transform duration-300 ${
                  index === current
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Logo décoratif animé */}
          <div className="absolute bottom-8 right-8 z-10 flex space-x-1">
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
  );
}
