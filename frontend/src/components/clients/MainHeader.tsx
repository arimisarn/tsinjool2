import { useEffect, useState } from "react";
import { Calendar, Bell, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../../assets/avatar.jpg";
import DarkMode from "../theme/DarkMode";

const MainHeader: React.FC = () => {
  const navigate = useNavigate();

  const daty: Date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatDate: string = daty.toLocaleDateString("fr-FR", options);
  const dateParts: string[] = formatDate.split(" ");
  const ordreDate: string = `${dateParts[0]} ${dateParts[1]} ${dateParts[2]} ${dateParts[3]}`;

  const [profilePhoto, setProfilePhoto] = useState<string>(pic);
  useEffect(() => {
    const loadProfilePhoto = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        const photoPath = res.data.photo;
        console.log("Photo reçue :", photoPath);

        if (photoPath) {
          if (
            photoPath.startsWith("http") &&
            !photoPath.includes("/image/upload/")
          ) {
            // Correction d'URL pour contourner OpaqueResponseBlocking
            const segments = photoPath.split("/").slice(-2); // e.g. ["profiles", "filename.jpg"]
            const fixedUrl = `https://res.cloudinary.com/tsinjool-media/image/upload/${segments.join(
              "/"
            )}`;
            setProfilePhoto(fixedUrl);
          } else {
            setProfilePhoto(photoPath);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de la photo de profil :",
          error
        );
      }
    };

    loadProfilePhoto();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-6 py-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Logo + Texte */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Tsinjool
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Votre coach personnel intelligenteee
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90 transition">
            Démo 0/7 jours
          </div>

          <div className="flex items-center gap-4">
            <DarkMode />

            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{ordreDate}</span>
              <Bell className="w-5 h-5 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition" />
              <img
                src={profilePhoto}
                className="w-8 h-8 rounded-full border-2 border-gray-400 dark:border-white cursor-pointer transition-all"
                alt="Profil utilisateur"
                onClick={() => navigate("/profile")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
