import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://tsinjool-backend.onrender.com/api/register/", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Inscription réussie !");
      navigate("/profile-setup");
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
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Formulaire */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-5"
        >
          <h2 className="text-3xl font-extrabold text-center text-indigo-700">
            Créer un compte
          </h2>

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="nom_utilisateur"
            placeholder="Nom d'utilisateur"
            value={formData.nom_utilisateur}
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
          <Input
            type="password"
            name="password2"
            placeholder="Confirmer mot de passe"
            value={formData.password2}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </form>
      </div>

      {/* Carrousel animé (desktop only) */}
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
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-10 text-white">
              <h3 className="text-4xl font-bold drop-shadow mb-2">
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
