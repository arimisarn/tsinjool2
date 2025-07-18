import { useEffect, useState, useRef } from "react";
import { Calendar, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../../assets/avatar.jpg";
import DarkMode from "../theme/DarkMode";
import logo from "../../assets/logoRond.png";
import NotificationDropdown from "./NotificationDropdown";

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const daty = new Date();
  const formatDate = daty.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [profilePhoto, setProfilePhoto] = useState(pic);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPhoto = async () => {
      const token = localStorage.getItem("token");
      console.log("Token actuel :", token);
      if (!token) return;

      try {
        const res = await axios.get(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Profil reçu :", res.data);

        const url = res.data?.photo_url;
        if (url && url.startsWith("http")) {
          setProfilePhoto(url);
        }

        setUser({
          name: res.data.user.nom_utilisateur,
          email: res.data.user.email,
        });
      } catch (err: any) {
        console.error("Erreur chargement photo", err);
        if (err.response) {
          console.error("Réponse erreur :", err.response.data);
        }
      }
    };

    loadPhoto();
  }, []);

  // Fermer dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4 max-w-[1280px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img src={logo} alt="" className="w-10 h-10" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Tsinjool
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <DarkMode />

          {/* Date */}
          <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap">
            <Calendar className="w-4 h-4" />
            {formatDate}
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-full"
            >
              <img
                src={profilePhoto}
                alt="Profil utilisateur"
                className="w-9 h-9 rounded-full border-2 border-purple-300 dark:border-purple-500 cursor-pointer hover:scale-105 transition-transform duration-200"
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden z-50 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-zinc-700">
                  <img
                    src={profilePhoto}
                    alt="Photo de profil"
                    className="w-12 h-12 rounded-full border-2 border-purple-300 dark:border-purple-500"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col py-2">
                  <button className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                    <User className="w-5 h-5" />
                    Voir profil
                  </button>

                  <button className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                    <Settings className="w-5 h-5" />
                    Modifier profil
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-500 transition-colors font-semibold"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 dark:text-gray-500 py-2 border-t border-gray-200 dark:border-zinc-700 select-none">
                  © Tsinjool 2025
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-5px);}
          to {opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
    </header>
  );
};

export default MainHeader;
