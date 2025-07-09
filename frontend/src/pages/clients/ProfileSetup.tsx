import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const coachingOptions = [
  { value: "life", label: "Coaching de vie" },
  { value: "career", label: "Coaching de carrière" },
  { value: "health", label: "Coaching santé" },
];

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [bio, setBio] = useState("");
  const [coachingType, setCoachingType] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prévisualisation de la photo
  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coachingType) {
      toast.error("Veuillez choisir un type de coaching.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("bio", bio);
      formData.append("coaching_type", coachingType);
      if (photoFile) formData.append("photo", photoFile);

      await axios.put("https://tsinjool-backend.onrender.com/api/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil mis à jour !");
      navigate("/dashboard"); // Redirection après config profil (à adapter)
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">Configurer votre profil</h2>

        <div>
          <label htmlFor="bio" className="block mb-2 font-semibold text-gray-700">
            Bio
          </label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Parlez-nous un peu de vous..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <label htmlFor="coachingType" className="block mb-2 font-semibold text-gray-700">
            Type de coaching
          </label>
          <select
            id="coachingType"
            value={coachingType}
            onChange={(e) => setCoachingType(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>
              Sélectionnez un type
            </option>
            {coachingOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Photo de profil</label>

          <label
            htmlFor="photo-upload"
            className="flex items-center justify-center cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 hover:border-indigo-500 transition-colors"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Aperçu de la photo"
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          {loading ? "Enregistrement..." : "Enregistrer le profil"}
        </Button>
      </form>
    </div>
  );
}
