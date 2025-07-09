import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [coachingType, setCoachingType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file)); // 💡 Prévisualisation
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachingType) {
      toast.error("Veuillez sélectionner un type de coaching.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("coaching_type", coachingType);
    if (photo) formData.append("photo", photo);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "https://tsinjool-backend.onrender.com/api/profile/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Réponse backend :", response.data); // debug
      toast.success("Profil mis à jour avec succès !");

      // Optionnel : message d'accueil personnalisé
      if (response.data && response.data.nom_utilisateur) {
        toast.info(`Bienvenue, ${response.data.nom_utilisateur} !`);
      }

      navigate("/dashboard");
    } catch (error: any) {
      console.error(
        "❌ Erreur backend :",
        error.response?.data || error.message
      );
      toast.error("Erreur lors de l’enregistrement du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-4">
          Configuration du profil
        </h2>

        <textarea
          name="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Présentez-vous..."
          className="w-full h-24 p-3 border rounded-lg resize-none"
        />

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Type de coaching
          </label>
          <select
            value={coachingType}
            onChange={(e) => setCoachingType(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">-- Sélectionnez --</option>
            <option value="fitness">Fitness</option>
            <option value="nutrition">Nutrition</option>
            <option value="mindset">Développement personnel</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">
            Photo de profil
          </label>
          <Input type="file" accept="image/*" onChange={handlePhotoChange} />
          {preview && (
            <img
              src={preview}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded-full mx-auto mt-3"
            />
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
}
