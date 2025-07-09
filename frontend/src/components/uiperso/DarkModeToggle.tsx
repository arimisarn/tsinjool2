import React from "react";
export const DarkModeToggle = ({ className = "", size = "default" }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Applique la classe 'dark' au document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Tailles disponibles
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-12 h-12"
  };

  const iconSizes = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6"
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center bg-yellow-100 dark:bg-gray-800 hover:bg-yellow-200 dark:hover:bg-gray-700 text-yellow-600 dark:text-yellow-400 transition-all duration-500 transform hover:scale-110 ${className}`}
      aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <div className="relative">
        <svg
          className={`${iconSizes[size]} transition-all duration-500 ${
            isDarkMode
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
        </svg>
        <svg
          className={`${iconSizes[size]} absolute inset-0 transition-all duration-500 ${
            isDarkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      </div>
    </button>
  );
};