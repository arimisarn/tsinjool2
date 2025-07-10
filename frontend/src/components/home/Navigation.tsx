import {
  Brain,
  Target,
  BookOpen,
  MessageCircle,
  Trophy,
  Home,
  Menu,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useState } from "react";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b transition-colors duration-500 px-6 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      {/* Desktop Menu */}
      <div className="hidden md:block">
        <NavigationMenu className="dark:text-white">
          <NavigationMenuList>
            {/* ... Ton menu complet desktop ici ... */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <Home className="w-5 h-5 mr-2" />
                Accueil
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Les autres items comme dans ton code d’origine */}
            {/* N’oublie pas de copier-coller tout le contenu NavigationMenuList ici */}
            {/* ... */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden justify-end">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer menu" : "Ouvrir menu"}
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-800 dark:text-white" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto p-6">
          {/* Bouton fermer */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer menu"
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <X className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
          </div>

          {/* Liste simplifiée des liens */}
          <ul className="space-y-6 text-lg text-gray-900 dark:text-white">
            <li>
              <a href="/" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <Home className="w-6 h-6" />
                Accueil
              </a>
            </li>

            <li>
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer select-none list-none">
                  <Target className="w-6 h-6" />
                  Programmes de Coaching
                </summary>
                <ul className="mt-2 ml-6 space-y-3">
                  <li>
                    <a href="/" className="block hover:text-blue-600 dark:hover:text-blue-400">
                      Programmes Personnalisés
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">
                      Développement Personnel
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">
                      Coaching Professionnel
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">
                      Bien-être & Santé
                    </a>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer select-none list-none">
                  <Brain className="w-6 h-6" />
                  IA & Méthodes
                </summary>
                <ul className="mt-2 ml-6 space-y-3">
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Coach IA Personnel</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Analyse Comportementale</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Suivi Personnalisé</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Méthodes Validées</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Sessions Interactives</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Recommandations</a></li>
                </ul>
              </details>
            </li>

            <li>
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer select-none list-none">
                  <BookOpen className="w-6 h-6" />
                  Ressources
                </summary>
                <ul className="mt-2 ml-6 space-y-3">
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Guides Pratiques</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Exercices Interactifs</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Témoignages</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Blog & Articles</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">Webinaires</a></li>
                  <li><a href="#" className="block hover:text-blue-600 dark:hover:text-blue-400">FAQ</a></li>
                </ul>
              </details>
            </li>

            <li>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <Trophy className="w-6 h-6" />
                Succès & Résultats
              </a>
            </li>

            <li>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400">
                <MessageCircle className="w-6 h-6" />
                Support
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
