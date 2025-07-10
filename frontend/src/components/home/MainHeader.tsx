import { Brain, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import DarkMode from "../theme/DarkMode";

const MainHeader = () => {
  return (
    <div className="border-b border-border bg-background px-4 py-3 md:px-6 md:py-4 transition-colors duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between max-w-7xl mx-auto gap-4 md:gap-0">
        {/* Logo and Title Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground transition-colors duration-300 whitespace-nowrap">
              Tsinjool
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground transition-colors duration-300 whitespace-nowrap">
              Votre coach personnel intelligent
            </p>
          </div>
        </div>

        {/* Action Buttons and Dark Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Dark Mode Toggle */}
          <div className="flex justify-end sm:justify-start w-full sm:w-auto order-last sm:order-none">
            <DarkMode />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-1 sm:flex-none items-center gap-2 w-full sm:w-auto">
            <Link
              to="/login"
              className="flex-1 text-center sm:flex-auto px-4 py-2 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300 whitespace-nowrap"
            >
              <LogIn className="w-4 h-4 mr-2 inline" />
              Se connecter
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center sm:flex-auto bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
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