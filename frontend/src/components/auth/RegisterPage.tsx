import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // HeroUI utilise Sonner pour les toasts
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      // Envoi des données au backend
      const response = await axios.post("https://tsinjool-backend.onrender.com/api/register/", formData);

      // ✅ Récupère le token
      const token = response.data.token;
      localStorage.setItem("token", token); // ✅ Stockage

      toast.success("Inscription réussie !");
      navigate("/profile-setup"); // ✅ Redirection directe

      // Reset du formulaire
      setFormData({
        email: "",
        nom_utilisateur: "",
        password: "",
        password2: "",
      });
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.nom_utilisateur?.[0] ||
        "Une erreur est survenue.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-4">
          Créer un compte
        </h2>

        <Input
          type="email"
          placeholder="Email"
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
          placeholder="Confirmer mot de passe"
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
      </form>
    </div>
  );
}
