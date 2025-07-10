import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [coachingType, setCoachingType] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Vérifier présence token au chargement
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Veuillez vous connecter.");
      navigate("/login");
    }
  }, [navigate]);

  // Générer et nettoyer l'aperçu de la photo
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // Gestion du changement de fichier
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto(e.target.files[0]);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachingType) {
      toast.error("Veuillez choisir un type de coaching.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token manquant, veuillez vous reconnecter.");

      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("coaching_type", coachingType);
      if (photo) {
        formData.append("photo", photo);
      }

      await axios.put("https://tsinjool-backend.onrender.com/api/profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil mis à jour avec succès !");
      navigate("/dashboard");
    } catch (error: any) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error.message ||
        "Erreur lors de la mise à jour du profil.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-800 rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Configuration du profil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-gray-300 font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Parlez un peu de vous..."
              className="w-full rounded-xl bg-gray-700 text-white p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type de coaching */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Type de coaching
            </label>
            <select
              value={coachingType}
              onChange={(e) => setCoachingType(e.target.value)}
              className="w-full rounded-xl bg-gray-700 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                -- Sélectionnez un type --
              </option>
              <option value="sportif">Sportif</option>
              <option value="bien-etre">Bien-être</option>
              <option value="nutrition">Nutrition</option>
            </select>
          </div>

          {/* Photo de profil */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Photo de profil (optionnel)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="text-gray-300"
            />
            {preview && (
              <img
                src={preview}
                alt="Aperçu"
                className="mt-4 w-32 h-32 object-cover rounded-full border-4 border-blue-600"
              />
            )}
          </div>

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
