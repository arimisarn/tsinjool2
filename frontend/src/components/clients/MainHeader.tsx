import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pic from "../../assets/avatar.jpg";
import DarkMode from "../theme/DarkMode";
import logo from "../../assets/logoRond.png";
import NotificationDropdown from "./NotificationDropdown";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";

const MainHeader: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const daty = new Date();
  const formatDate = daty.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [profilePhoto, setProfilePhoto] = useState(pic);

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
      } catch (err) {
        console.error("Erreur chargement photo", err);
      }
    };

    loadPhoto();
  }, []);

  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="ml-auto w-[280px] bg-white dark:bg-zinc-900 border-l rounded-l-xl">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Mon compte
            </DrawerTitle>
            <DrawerDescription className="text-sm text-gray-600 dark:text-gray-400">
              Gérer vos informations
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 py-2 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                navigate("/profile");
                setDrawerOpen(false);
              }}
            >
              <User className="w-4 h-4 mr-2" />
              Voir profil
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                navigate("/profile-setup");
                setDrawerOpen(false);
              }}
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
        </DrawerContent>
      </Drawer>

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

            {/* Bell + badge */}
            <div className="relative">
              <NotificationDropdown />
            </div>

            {/* Avatar */}
            <img
              src={profilePhoto}
              alt="Profil utilisateur"
              className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-white cursor-pointer hover:scale-105 transition"
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainHeader;
