import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logoRond.png";
import DarkMode from "../theme/DarkMode";

const MainHeader = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 sm:px-6 py-4 transition-colors duration-500 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Logo + Titre */}
        <div className="flex items-center gap-3 min-w-0">
          <img src={logo} alt="logo" className="w-10 h-10 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 truncate">
              Tsinjool
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block transition-colors duration-300 truncate">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <DarkMode />

          <Link
            to="/login"
            className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300"
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Se connecter</span>
          </Link>

          <Link
            to="/register"
            className="flex items-center bg-gradient-to-r from-purple-500 to-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">S'inscrire</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
