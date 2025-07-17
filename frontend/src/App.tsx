import MainHeader from "./components/home/MainHeader";
import Navigation from "./components/home/Navigation";
import Hero from "./components/home/Hero";
import Demos from "./components/home/Demos";
import Fin from "./components/home/Fin";
import { useEffect } from "react";
import axios from "axios";

// Composant DarkModeToggle intégré

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(
        "https://tsinjool-backend.onrender.com/api/check-scheduled-exercises/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      )
      .then((res) => {
        console.log("🔔 Notifications planifiées vérifiées :", res.data);
        window.dispatchEvent(new Event("refresh-notifications"));
      })
      .catch((err) => {
        console.error("❌ Erreur vérification exercices planifiés", err);
      });
  }, []);
  useEffect(() => {
    document.title = "Tsinjool - Plateforme de coaching personnalisé via IA";
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Browser bar */}
      <div className="border-b border-border bg-muted px-4 py-2 flex items-center gap-3 transition-colors duration-500">
        {/* Contenu de la barre de navigation */}
      </div>

      {/* Main header */}
      <MainHeader />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}

      <Hero />
      {/* Section de démonstration avec les tokens de couleur */}
      <Demos />

      {/* Section avec boutons primaires et secondaires */}
      <Fin />
    </div>
  );
};

export default App;
