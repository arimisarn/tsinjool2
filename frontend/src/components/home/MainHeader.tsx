import { LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logoRond.png";
import DarkMode from "../theme/DarkMode";
const MainHeader = () => {
  return (
    <div className="border-b border-border bg-background px-6 py-4 transition-colors duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 flex items-center justify-center"
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground transition-colors duration-300">
              Tsinjool
            </h1>
            <p className="text-sm text-muted-foreground transition-colors duration-300">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DarkMode />

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300"
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
