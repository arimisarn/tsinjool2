import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Brain } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/carousel1.jpg",
    title: "Bienvenue chez Tsinjool",
    subtitle: "Votre coach IA personnalisé pour atteindre vos objectifs.",
  },
  {
    image: "/carousel2.jpg",
    title: "Connectez-vous à votre avenir",
    subtitle: "Un espace personnalisé pour suivre vos progrès.",
  },
  {
    image: "/carousel3.jpg",
    title: "Reprenez le contrôle",
    subtitle: "Gérez votre santé, vos objectifs, votre énergie.",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://tsinjool-backend.onrender.com/api/login/",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error: any) {
      const msg =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        "Nom d'utilisateur ou mot de passe incorrect.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
          </div>

          <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
              <h2 className="text-3xl font-bold text-indigo-400 text-center">
                Connexion à votre compte
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 transition-all duration-200 outline-none text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-xl bg-gray-800 focus:bg-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600 transition-all duration-200 outline-none text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <p className="text-center text-sm text-gray-400">
                Vous n’avez pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="text-indigo-400 hover:underline font-medium"
                >
                  S’inscrire
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Section carrousel */}
        <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[300px] lg:min-h-full">
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
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white px-10 text-center">
                  <h3 className="text-4xl font-bold mb-2 drop-shadow">
                    {slide.title}
                  </h3>
                  <p className="text-lg font-light">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
