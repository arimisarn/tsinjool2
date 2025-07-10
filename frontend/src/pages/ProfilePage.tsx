import  { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UserProfile {
  email: string;
  nom_utilisateur: string;
  bio: string;
  coaching_type: string;
  photo: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error: any) {
        console.error(error);
        toast.error("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-gradient-to-br from-purple-600 to-indigo-500">
        Chargement du profil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl bg-gradient-to-br from-purple-600 to-indigo-500">
        Profil non trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center space-y-4">
        <img
          src={profile.photo || "/default-avatar.png"} // si aucune photo
          alt="Photo de profil"
          className="w-32 h-32 object-cover rounded-full mx-auto"
        />
        <h2 className="text-2xl font-bold text-indigo-600">{profile.nom_utilisateur}</h2>
        <p className="text-gray-600 italic">{profile.email}</p>
        <div className="text-left space-y-2">
          <div>
            <span className="font-semibold">Bio :</span>
            <p>{profile.bio || "Aucune bio renseignée."}</p>
          </div>
          <div>
            <span className="font-semibold">Type de coaching :</span>
            <p className="capitalize">{profile.coaching_type}</p>
          </div>
        </div>

        <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">
          Modifier mon profil
        </Button>
      </div>
    </div>
  );
}
