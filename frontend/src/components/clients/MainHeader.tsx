import { useEffect, useState } from "react";
import { Calendar, Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../../assets/avatar.jpg";
import DarkMode from "../theme/DarkMode";
import logo from "../../assets/logoRond.png";

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
  const ordreDate: string = formatDate.replace(/^\w/, (c) => c.toUpperCase());

  const [profilePhoto, setProfilePhoto] = useState<string>(pic);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Bienvenue dans votre espace coaching !",
    "Un nouveau parcours a été généré.",
    "N'oubliez pas votre exercice du jour !",
  ]);
  console.log(setNotifications);

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

        const photoUrl = res.data?.photo_url;
        if (
          photoUrl &&
          typeof photoUrl === "string" &&
          photoUrl.startsWith("http")
        ) {
          setProfilePhoto(photoUrl);
        }
      } catch (error) {
        console.error("Erreur photo de profil :", error);
      }
    };

    loadProfilePhoto();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 sm:px-6 py-4 relative z-50">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Logo + Texte */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Tsinjool
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-5 text-sm sm:text-base">
          <DarkMode />

          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{ordreDate}</span>
          </div>

          {/* Bell + badge */}
          <div className="relative">
            <Bell
              className="w-6 h-6 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications.length}
              </div>
            )}

            {/* Dropdown notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-800 shadow-xl border border-gray-200 dark:border-zinc-600 rounded-lg p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Notifications
                  </h3>
                  <X
                    className="w-4 h-4 text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => setShowNotifications(false)}
                  />
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {notifications.map((notif, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-700 px-3 py-2 rounded-lg shadow-sm"
                    >
                      {notif}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Avatar */}
          <img
            src={profilePhoto}
            alt="Profil utilisateur"
            className="w-8 h-8 rounded-full border-2 border-gray-400 dark:border-white cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
