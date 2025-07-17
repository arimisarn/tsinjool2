import { useEffect, useState } from "react";
import { Calendar, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../../assets/avatar.jpg";
import DarkMode from "../theme/DarkMode";
import logo from "../../assets/logoRond.png";
import NotificationDropdown from "./NotificationDropdown";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    const loadPhoto = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          "https://tsinjool-backend.onrender.com/api/profile/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );

        const url = res.data?.photo_url;
        if (url && url.startsWith("http")) {
          setProfilePhoto(url);
        }

        setUser({
          name: res.data?.name || "Utilisateur",
          email: res.data?.email || "email@example.com",
        });
      } catch (err) {
        console.error("Erreur chargement photo", err);
      }
    };

    loadPhoto();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4 relative">
        {/* Logo */}
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
        <div className="flex items-center gap-4">
          <DarkMode />

          {/* Date */}
          <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
            <Calendar className="w-4 h-4" />
            {formatDate}
          </div>

          {/* Notifications */}
          <div className="relative">
            <NotificationDropdown />
          </div>

          {/* Avatar + Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <img
                src={profilePhoto}
                alt="Profil utilisateur"
                className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-white cursor-pointer hover:scale-105 transition"
              />
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="flex flex-col space-y-1">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user?.name || "Mon compte"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || "email@example.com"}
                    </span>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Voir profil
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile-setup")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier profil
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>

              <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                © Tsinjool 2025
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
