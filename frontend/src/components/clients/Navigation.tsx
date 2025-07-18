"use client";

import {
  BotMessageSquare,
  MessageCircle,
  Trophy,
  Sparkles,
  Search,
  Gauge,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 shadow-sm z-40 px-6 py-3 relative">
      {/* Grand écran : menu centré */}
      <div className="hidden md:flex justify-center">
        <NavigationMenu className="text-gray-900 dark:text-white">
          <NavigationMenuList className="flex gap-6">
            {/* Dashboard */}
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg px-3 py-2 flex items-center`}
                >
                  <Gauge className="w-5 h-5 mr-2" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Discuter avec l'IA */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg px-3 py-2 flex items-center">
                <BotMessageSquare className="w-5 h-5 mr-2" />
                Discuter avec l'IA
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-lg p-4 w-[600px]">
                <ul className="grid gap-4 lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a className="flex h-full w-full flex-col justify-end rounded-xl p-6 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-800/50 dark:to-purple-900 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-700/70 dark:hover:to-purple-800">
                        <BotMessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        <div className="mb-2 mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                          Discuter avec l'IA
                        </div>
                        <p className="text-sm leading-tight text-gray-600 dark:text-gray-300">
                          Vous pouvez discuter avec nos différentes IA
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>

                  {[
                    {
                      title: "Tsinjo (Coach IA)",
                      icon: (
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                      ),
                      description:
                        "Votre assistant IA personnel disponible 24/7",
                      path: "/coach-tsinjo",
                    },
                    {
                      title: "Assistant Vocal IA",
                      icon: (
                        <MessageCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mr-2" />
                      ),
                      description:
                        "Discutez oralement avec l'IA comme un vrai coach",
                      path: "/assistant-vocal",
                    },
                    {
                      title: "SenseAI (Coach Visuel)",
                      icon: (
                        <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                      ),
                      description:
                        "L'IA qui vous comprend par votre expression visuelle",
                      path: "/coach-visuel",
                    },
                  ].map((item, i) => (
                    <li key={i}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.path}
                          className="block space-y-1 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-zinc-700"
                        >
                          <div className="text-sm font-semibold flex items-center text-gray-900 dark:text-white">
                            {item.icon}
                            {item.title}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Mes Progrès */}
            <NavigationMenuItem>
              <Link to="/progress">
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg px-3 py-2 flex items-center`}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Mes Progrès
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Support */}
            <NavigationMenuItem>
              <Link to="/profile">
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg px-3 py-2 flex items-center`}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Support
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Petit écran : menu hamburger */}
      <div className="md:hidden flex justify-between items-center">
        <div></div> {/* Espace vide à gauche pour l'équilibre */}
        <button
          className="text-gray-900 dark:text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-3 px-2 pb-4">
          <div>
            Menu
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
          >
            <Gauge className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            to="/coach-tsinjo"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
          >
            <Sparkles className="w-5 h-5" /> Coach IA
          </Link>
          <Link
            to="/assistant-vocal"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
          >
            <MessageCircle className="w-5 h-5" /> Assistant Vocal
          </Link>
          <Link
            to="/coach-visuel"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
          >
            <Search className="w-5 h-5" /> Coach Visuel
          </Link>
          <Link
            to="/progress"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
          >
            <Trophy className="w-5 h-5" /> Mes Progrès
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white"
          >
            <MessageCircle className="w-5 h-5" /> Support
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
