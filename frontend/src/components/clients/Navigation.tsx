"use client";

import {
  BotMessageSquare,
  MessageCircle,
  Trophy,
  Sparkles,
  Search,
  Gauge,
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

const Navigation = () => {
  return (
    <nav className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm top-[72px] z-40 px-6 sm:px-8 py-4 transition-colors duration-300">
      <NavigationMenu className="text-gray-900 dark:text-gray-100 max-w-[1280px] mx-auto">
        <NavigationMenuList className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-8">
          <NavigationMenuItem>
            <Link to="/dashboard">
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md px-4 py-2.5 flex items-center`}
              >
                <Gauge className="w-5 h-5 mr-2" />
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md px-4 py-2.5 flex items-center">
              <BotMessageSquare className="w-5 h-5 mr-2" />
              Discuter avec l'IA
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg p-5 w-full md:w-[500px] lg:w-[600px]">
              <ul className="grid gap-4 lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full flex-col justify-end rounded-md p-6 no-underline outline-none transition-colors
                        bg-gradient-to-b from-purple-50 to-purple-100
                        dark:from-purple-800/50 dark:to-purple-900
                        hover:from-purple-100 hover:to-purple-200
                        dark:hover:from-purple-700/70 dark:hover:to-purple-800"
                    >
                      <BotMessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      <div className="mb-2 mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
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
                    description: "Votre assistant IA personnel disponible 24/7",
                    path: "/coach-tsinjo",
                  },
                  {
                    title: "Assistant Vocal IA",
                    icon: (
                      <MessageCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mr-2" />
                    ),
                    description:
                      "Discutez oralement avec l’IA comme un vrai coach",
                    path: "/assistant-vocal",
                  },
                  {
                    title: "SenseAI (Coach Visuel)",
                    icon: (
                      <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    ),
                    description:
                      "L’IA qui vous comprend par votre expression visuelle",
                    path: "/coach-visuel",
                  },
                ].map((item, i) => (
                  <li key={i}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.path}
                        className="block space-y-1 rounded-md p-3 transition-colors
                          hover:bg-gray-100 dark:hover:bg-zinc-700
                          focus:bg-gray-100 dark:focus:bg-zinc-700"
                      >
                        <div className="text-sm font-semibold flex items-center text-gray-900 dark:text-gray-100">
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
            <Link to="/progress">
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md px-4 py-2.5 flex items-center`}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Mes Progrès
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/profile">
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-md px-4 py-2.5 flex items-center`}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Support
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default Navigation;
