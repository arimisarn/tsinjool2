"use client";

import {
  Brain,
  BotMessageSquare,
  MessageCircle,
  Trophy,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  Gauge,
  LogOut,
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

import { Link } from "react-router-dom";
import LogoutButton from "./LogoutBUtton";

const Navigation = () => {
  return (
    <div className="border-b transition-colors duration-500 px-6 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <NavigationMenu className="text-gray-900 dark:text-white">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <Gauge className="w-5 h-5 mr-2" />
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              <BotMessageSquare className="w-5 h-5 mr-2" />
              Discuter avec l'IA
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a className="flex h-full w-full flex-col justify-end rounded-md p-6 no-underline outline-none transition-colors bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-800/50 dark:to-purple-800 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-700/50 dark:hover:to-purple-700">
                      <BotMessageSquare className="h-8 w-8 text-purple-500" />
                      <div className="mb-2 mt-4 text-lg font-medium text-gray-900 dark:text-white">
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
                    icon: <Sparkles className="w-4 h-4 text-purple-500 mr-2" />,
                    description: "Votre assistant IA personnel disponible 24/7",
                    path: "/coach-tsinjo",
                  },
                  {
                    title: "Assistant Vocal IA",
                    icon: (
                      <MessageCircle className="w-4 h-4 text-cyan-500 mr-2" />
                    ),
                    description:
                      "Discutez oralement avec l’IA comme un vrai coach",
                    path: "/assistant-vocal",
                  },
                  {
                    title: "SenseAI (Coach Visuel)",
                    icon: <Search className="w-4 h-4 text-blue-500 mr-2" />,
                    description:
                      "L’IA qui vous comprend par votre expression visuelle",
                    path: "/coach-visuel",
                  },
                ].map((item, i) => (
                  <li key={i}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="block space-y-1 rounded-md p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                      >
                        <div className="text-sm font-medium flex items-center text-gray-900 dark:text-white">
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

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
              <Brain className="w-5 h-5 mr-2" />
              IA & Méthodes
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {[
                  "Coach IA Personnel",
                  "Analyse Comportementale",
                  "Suivi Personnalisé",
                  "Méthodes Validées",
                  "Sessions Interactives",
                  "Recommandations",
                ].map((title, i) => {
                  const icons = [
                    <Sparkles className="w-4 h-4 text-purple-500" />,
                    <Search className="w-4 h-4 text-blue-500" />,
                    <TrendingUp className="w-4 h-4 text-green-500" />,
                    <CheckCircle className="w-4 h-4 text-emerald-500" />,
                    <MessageCircle className="w-4 h-4 text-cyan-500" />,
                    <Filter className="w-4 h-4 text-orange-500" />,
                  ];
                  const descriptions = [
                    "Votre assistant intelligent 24/7",
                    "Compréhension de vos habitudes",
                    "Adaptation en temps réel",
                    "Approches scientifiques éprouvées",
                    "Conversations naturelles avec l'IA",
                    "Suggestions personnalisées",
                  ];
                  return (
                    <li key={i}>
                      <NavigationMenuLink asChild>
                        <a className="block space-y-1 rounded-md p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700">
                          <div className="text-sm font-medium flex items-center text-gray-900 dark:text-white">
                            {icons[i]}
                            <span className="ml-2">{title}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {descriptions[i]}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <Trophy className="w-5 h-5 mr-2" />
              Succès & Résultats
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <Link to="/profile">Support</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
              <LogOut className="w-5 h-5 mr-2" />
              <LogoutButton />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navigation;
