import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const slides = [
  {
    image: "/carousel1.jpg",
    title: "Coaching personnalisé",
    subtitle: "Adaptez votre parcours selon vos objectifs personnels.",
  },
  {
    image: "/carousel2.jpg",
    title: "Suivi intelligent",
    subtitle: "Notre IA suit vos progrès et vous guide au quotidien.",
  },
  {
    image: "/carousel3.jpg",
    title: "Gagnez en motivation",
    subtitle: "Fixez des objectifs et atteignez-les avec un coach virtuel.",
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post(
        "https://tsinjool-backend.onrender.com/api/register/",
        formData
      );
      localStorage.setItem("token", response.data.token);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl space-y-5"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700">
            Créer un compte
          </h2>

          <Input
            type="email"
            placeholder="Adresse email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            name="nom_utilisateur"
            value={formData.nom_utilisateur}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            placeholder="Confirmer le mot de passe"
            name="password2"
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
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>

      {/* Carousel Section - visible uniquement sur desktop */}
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 transition-all duration-700 ease-in-out">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-10 text-center">
            <h3 className="text-3xl font-bold mb-2">
              {slides[currentSlide].title}
            </h3>
            <p className="text-lg">{slides[currentSlide].subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
