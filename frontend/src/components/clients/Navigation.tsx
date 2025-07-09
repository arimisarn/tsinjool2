import {
  Brain,
  BotMessageSquare,
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
  Gauge ,
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
  return (
      <div className="border-b transition-colors duration-500 px-6 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <NavigationMenu className="dark:text-white">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <Gauge className="w-5 h-5 mr-2" />
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                <BotMessageSquare className="w-5 h-5 mr-2" />
                Discuter avec l'IA
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline outline-none focus:shadow-md transition-colors duration-300 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-800/50 dark:to-purple-800 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-700/50 dark:hover:to-purple-700"
                        href="/"
                      >
                        <BotMessageSquare className="h-8 w-8 text-purple-500" />
                        <div className="mb-2 mt-4 text-lg font-medium text-gray-900 dark:text-white">
                           Discuter avec l'IA
                        </div>
                        <p className="text-sm leading-tight text-gray-600 dark:text-gray-300">
                          Vous pouvez discuteravec nos differentes Intelligences Artifielles
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

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <Trophy className="w-5 h-5 mr-2" />
                Succès & Résultats
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800`}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Support
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
  )
}

export default Navigation
