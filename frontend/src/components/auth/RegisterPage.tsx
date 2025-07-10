import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

interface FormData {
  email: string;
  nom_utilisateur: string;
  password: string;
  password2: string;
}

const slides: Slide[] = [
  {
    image: "/carousel1.jpg",
    title: "Coaching personnalisé",
    subtitle: "Un accompagnement adapté à vos besoins et objectifs.",
  },
  {
    image: "/carousel2.jpg",
    title: "Suivi intelligent",
    subtitle: "L'IA suit vos progrès et vous motive chaque jour.",
  },
  {
    image: "/carousel3.jpg",
    title: "Atteignez vos objectifs",
    subtitle: "Avec un coach digital qui ne vous laisse jamais tomber.",
  },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Inscription réussie !");
      // navigate("/profile-setup");
    } catch (error) {
      alert("Erreur lors de l'inscription.");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Section formulaire */}
        <div className="w-full lg:w-1/2 flex flex-col relative">
          
          {/* Header avec logo et navigation */}
          <div className="flex justify-between items-center p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-gray-900">Anywhere app.</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-blue-500 font-medium">Home</a>
              <a href="#" className="text-gray-500 hover:text-blue-500 font-medium">Join</a>
            </div>
          </div>

          {/* Formulaire */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md">
              
              <div className="mb-8">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">START FOR FREE</p>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Create new account<span className="text-blue-500">.</span>
                </h1>
                <p className="text-gray-600">
                  Already A Member? <a href="#" className="text-blue-500 hover:underline font-medium">Log In</a>
                </p>
              </div>

              <div className="space-y-4">
                
                {/* Nom et email sur la même ligne */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nom_utilisateur"
                        value={formData.nom_utilisateur}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                        placeholder="Michel"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                        placeholder="michel.masiak@anywhere.co"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 py-3 px-6 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Change method
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section image avec carrousel */}
        <div className="w-full lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-400 to-teal-500 min-h-[300px] lg:min-h-full">
          <div className="absolute inset-0 w-full h-full">
            {/* Image de fond par défaut avec effet de montagne */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-teal-400 to-green-500 relative">
              {/* Simulation d'un paysage de montagne */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-teal-800/30 to-transparent"></div>
              
              {/* Contenu du slide */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-white">
                <h3 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">
                  {slides[current].title}
                </h3>
                <p className="text-lg lg:text-xl font-light max-w-md">
                  {slides[current].subtitle}
                </p>
              </div>

              {/* Indicateurs de slide */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === current ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {/* Logo décoratif */}
              <div className="absolute bottom-8 right-8">
                <div className="flex space-x-1">
                  <div className="w-8 h-2 bg-white/80 rounded-full transform rotate-45"></div>
                  <div className="w-8 h-2 bg-white/80 rounded-full transform rotate-45"></div>
                  <div className="w-8 h-2 bg-white/80 rounded-full transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}