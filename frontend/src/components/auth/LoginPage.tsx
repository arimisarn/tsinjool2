import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  // Changement de slide toutes les 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Formulaire de connexion */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-5"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            Connexion
          </h2>

          <Input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Vous n’avez pas encore de compte ?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">
              S’inscrire
            </Link>
          </p>
        </form>
      </div>

      {/* Carrousel animé - visible seulement sur desktop */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white px-10 text-center">
              <h3 className="text-4xl font-bold mb-2 drop-shadow">
                {slides[current].title}
              </h3>
              <p className="text-lg font-light">{slides[current].subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
