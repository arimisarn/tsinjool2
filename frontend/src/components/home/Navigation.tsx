import { useState } from "react";
import {
  Brain,
  Target,
  Users,
  BookOpen,
  MessageCircle,
  Trophy,
  Play,
  CheckCircle,
  Zap,
  TrendingUp,
  Heart,
  Sparkles,
  Search,
  Filter,
  Home,
  // Import Menu and X icons for the mobile toggle
  Menu,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  // State to manage the mobile menu's open/close status
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to close the mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b transition-colors duration-500 px-4 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Home Link - Always visible, but only NavigationMenu for desktop */}
        {/* On mobile, we'll just have the "Accueil" link as part of the list */}
        <div className="flex items-center">
          <NavigationMenu className="dark:text-white hidden md:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center`}
                  href="/"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Accueil
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {/* A simple brand/home link for mobile when NavigationMenu is hidden */}
          <a href="/" className="md:hidden text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Home className="w-6 h-6 mr-2 text-purple-500" />
            Coaching AI
          </a>
        </div>

        {/* Desktop Navigation Menu (hidden on small screens) */}
        <NavigationMenu className="dark:text-white hidden md:block">
          <NavigationMenuList className="flex space-x-4">
            {/* Programmes de Coaching */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <Target className="w-5 h-5 mr-2" />
                Programmes de Coaching
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md transition-colors duration-300 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-800/50 dark:to-purple-800 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-700/50 dark:hover:to-purple-700"
                        href="/"
                      >
                        <Target className="h-8 w-8 text-purple-500" />
                        <div className="mb-2 mt-4 text-lg font-medium text-gray-900 dark:text-white">
                          Programmes Personnalisés
                        </div>
                        <p className="text-sm leading-tight text-gray-600 dark:text-gray-300">
                          Découvrez nos programmes de coaching adaptés à vos
                          objectifs
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                        href="#"
                      >
                        <div className="text-sm font-medium leading-none flex items-center text-gray-900 dark:text-white">
                          <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                          Développement Personnel
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                          Confiance en soi, gestion du stress, habitudes
                          positives
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                        href="#"
                      >
                        <div className="text-sm font-medium leading-none flex items-center text-gray-900 dark:text-white">
                          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                          Coaching Professionnel
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                          Leadership, productivité, évolution de carrière
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                        href="#"
                      >
                        <div className="text-sm font-medium leading-none flex items-center text-gray-900 dark:text-white">
                          <Heart className="w-4 h-4 mr-2 text-red-500" />
                          Bien-être & Santé
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                          Équilibre vie-travail, nutrition, fitness mental
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* IA & Méthodes */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <Brain className="w-5 h-5 mr-2" />
                IA & Méthodes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {[
                    {
                      title: "Coach IA Personnel",
                      desc: "Votre assistant intelligent 24/7",
                      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
                    },
                    {
                      title: "Analyse Comportementale",
                      desc: "Compréhension de vos habitudes",
                      icon: <Search className="w-4 h-4 text-blue-500" />,
                    },
                    {
                      title: "Suivi Personnalisé",
                      desc: "Adaptation en temps réel",
                      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
                    },
                    {
                      title: "Méthodes Validées",
                      desc: "Approches scientifiques éprouvées",
                      icon: (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ),
                    },
                    {
                      title: "Sessions Interactives",
                      desc: "Conversations naturelles avec l'IA",
                      icon: <MessageCircle className="w-4 h-4 text-cyan-500" />,
                    },
                    {
                      title: "Recommandations",
                      desc: "Suggestions personnalisées",
                      icon: <Filter className="w-4 h-4 text-orange-500" />,
                    },
                  ].map((item, index) => (
                    <li key={index}>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                          href="#"
                        >
                          <div className="text-sm font-medium leading-none flex items-center text-gray-900 dark:text-white">
                            {item.icon}
                            <span className="ml-2">{item.title}</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Ressources */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <BookOpen className="w-5 h-5 mr-2" />
                Ressources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {[
                    {
                      title: "Guides Pratiques",
                      desc: "Méthodes étape par étape",
                      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
                    },
                    {
                      title: "Exercices Interactifs",
                      desc: "Mises en pratique guidées",
                      icon: <Play className="w-4 h-4 text-green-500" />,
                    },
                    {
                      title: "Témoignages",
                      desc: "Histoires de réussite",
                      icon: <Users className="w-4 h-4 text-purple-500" />,
                    },
                    {
                      title: "Blog & Articles",
                      desc: "Conseils d'experts",
                      icon: <BookOpen className="w-4 h-4 text-orange-500" />,
                    },
                    {
                      title: "Webinaires",
                      desc: "Sessions live avec experts",
                      icon: <Play className="w-4 h-4 text-red-500" />,
                    },
                    {
                      title: "FAQ",
                      desc: "Questions fréquentes",
                      icon: <MessageCircle className="w-4 h-4 text-cyan-500" />,
                    },
                  ].map((item, index) => (
                    <li key={index}>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white"
                          href="#"
                        >
                          <div className="text-sm font-medium leading-none flex items-center text-gray-900 dark:text-white">
                            {item.icon}
                            <span className="ml-2">{item.title}</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-600 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Succès & Résultats */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
                href="#"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Succès & Résultats
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Support */}
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
                href="#"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Support
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Hamburger Button (visible on small screens only) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" /> // 'X' icon when menu is open
          ) : (
            <Menu className="w-6 h-6" /> // 'Menu' icon when menu is closed
          )}
        </button>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <ul className="flex flex-col space-y-1 px-4 py-3">
            <li>
              <a
                href="/"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
                onClick={closeMobileMenu} // Close menu on click
              >
                <Home className="w-5 h-5 mr-2" />
                Accueil
              </a>
            </li>

            {/* Mobile: Programmes de Coaching with <details> for expand/collapse */}
            <li>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 list-none">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Programmes de Coaching
                  </div>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <ul className="pl-8 mt-2 flex flex-col space-y-1">
                  <li>
                    <a
                      href="/"
                      className="block px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={closeMobileMenu}
                    >
                      Programmes Personnalisés
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={closeMobileMenu}
                    >
                      Développement Personnel
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={closeMobileMenu}
                    >
                      Coaching Professionnel
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={closeMobileMenu}
                    >
                      Bien-être & Santé
                    </a>
                  </li>
                </ul>
              </details>
            </li>

            {/* Mobile: IA & Méthodes */}
            <li>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 list-none">
                  <div className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    IA & Méthodes
                  </div>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <ul className="pl-8 mt-2 flex flex-col space-y-1">
                  {/* Reuse the data from the desktop menu */}
                  {[
                    { title: "Coach IA Personnel", icon: <Sparkles className="w-4 h-4 mr-2 text-purple-500" /> },
                    { title: "Analyse Comportementale", icon: <Search className="w-4 h-4 mr-2 text-blue-500" /> },
                    { title: "Suivi Personnalisé", icon: <TrendingUp className="w-4 h-4 mr-2 text-green-500" /> },
                    { title: "Méthodes Validées", icon: <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" /> },
                    { title: "Sessions Interactives", icon: <MessageCircle className="w-4 h-4 mr-2 text-cyan-500" /> },
                    { title: "Recommandations", icon: <Filter className="w-4 h-4 mr-2 text-orange-500" /> },
                  ].map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                        onClick={closeMobileMenu}
                      >
                        {item.icon}
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            {/* Mobile: Ressources */}
            <li>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2 list-none">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Ressources
                  </div>
                  <span className="transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <ul className="pl-8 mt-2 flex flex-col space-y-1">
                  {/* Reuse the data from the desktop menu */}
                  {[
                    { title: "Guides Pratiques", icon: <BookOpen className="w-4 h-4 mr-2 text-blue-500" /> },
                    { title: "Exercices Interactifs", icon: <Play className="w-4 h-4 mr-2 text-green-500" /> },
                    { title: "Témoignages", icon: <Users className="w-4 h-4 mr-2 text-purple-500" /> },
                    { title: "Blog & Articles", icon: <BookOpen className="w-4 h-4 mr-2 text-orange-500" /> },
                    { title: "Webinaires", icon: <Play className="w-4 h-4 mr-2 text-red-500" /> },
                    { title: "FAQ", icon: <MessageCircle className="w-4 h-4 mr-2 text-cyan-500" /> },
                  ].map((item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="px-3 py-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                        onClick={closeMobileMenu}
                      >
                        {item.icon}
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            {/* Succès & Résultats (Mobile) */}
            <li>
              <a
                href="#"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
                onClick={closeMobileMenu}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Succès & Résultats
              </a>
            </li>
            {/* Support (Mobile) */}
            <li>
              <a
                href="#"
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-3 py-2"
                onClick={closeMobileMenu}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
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