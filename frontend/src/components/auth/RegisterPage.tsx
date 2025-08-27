import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Tsinjool - Inscription";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (formData.password !== formData.password2) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://backend-tsinjool.onrender.com/api/register/",
        formData
      );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        {/* Formulaire */}
        <div className="w-full lg:w-1/2 flex flex-col relative">
          <div className="flex justify-between items-center p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <Link to="/">
                <img src={logo} alt="Logo Tsinjool" className="w-10 h-10" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tsinjool
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Votre coach personnel intelligent
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 dark:text-purple-400 hover:underline font-medium"
            >
              Se connecter
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex-1 flex items-center justify-center p-6 lg:p-8"
          >
            <div className="w-full max-w-md space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Créer un compte
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Commencez gratuitement dès maintenant.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Nom d'utilisateur
                  </label>
                  <input
                    name="nom_utilisateur"
                    value={formData.nom_utilisateur}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="JeanDupont"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    name="password2"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "S'inscrire"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Section carrousel avec animations */}
        <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[300px] lg:min-h-full">
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                  index === current
                    ? "opacity-100 translate-x-0"
                    : index < current
                    ? "opacity-0 -translate-x-full"
                    : "opacity-0 translate-x-full"
                }`}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${slide.gradient} relative`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white px-8 text-center">
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                      {slide.title}
                    </h3>
                    <p className="text-lg lg:text-xl font-light max-w-md">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Décors animés */}
                  <div
                    className={`absolute top-8 left-8 ${
                      index === current
                        ? "opacity-60 scale-100"
                        : "opacity-0 scale-75"
                    } transition-all duration-1000`}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full blur-sm"></div>
                  </div>
                  <div
                    className={`absolute top-1/4 right-12 ${
                      index === current
                        ? "opacity-40 scale-100"
                        : "opacity-0 scale-75"
                    } transition-all duration-1000 delay-200`}
                  >
                    <div className="w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
                  </div>
                  <div
                    className={`absolute bottom-1/4 left-12 ${
                      index === current
                        ? "opacity-50 scale-100"
                        : "opacity-0 scale-75"
                    } transition-all duration-1000 delay-400`}
                  >
                    <div className="w-20 h-20 bg-white/15 rounded-full blur-md"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
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
        </div>
      </div>
    </div>
  );
}
