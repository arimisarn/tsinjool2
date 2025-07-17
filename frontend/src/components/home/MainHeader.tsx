import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logoRond.png";
import DarkMode from "../theme/DarkMode";

const MainHeader = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 px-4 sm:px-6 py-4 transition-colors duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Logo + Titre */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Tsinjool
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block transition-colors duration-300">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <DarkMode />

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300"
            >
              <LogIn className="w-4 h-4 mr-2 inline" />
              Se connecter
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <UserPlus className="w-4 h-4 mr-2 inline" />
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
