import {
  Brain,
  Target,
  BookOpen,
  MessageCircle,
  Trophy,
  CheckCircle,
  Zap,
  TrendingUp,
  Heart,
  Sparkles,
  Search,
  Home,
  Menu,
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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <div className="border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-colors duration-300 px-4 sm:px-6 py-2">
      {/* Responsive menu trigger (mobile only) */}
      <div className="flex justify-between items-center sm:hidden">
        <span className="text-gray-900 dark:text-white font-semibold text-lg">Menu</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5 text-gray-800 dark:text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:w-80 bg-white dark:bg-zinc-900">
            <div className="mt-6 space-y-2 text-gray-900 dark:text-white">
              <a href="/" className="flex items-center gap-2 hover:text-purple-600">
                <Home className="w-4 h-4" />
                Accueil
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600">
                <Target className="w-4 h-4" />
                Programmes
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600">
                <Brain className="w-4 h-4" />
                IA & Méthodes
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600">
                <BookOpen className="w-4 h-4" />
                Ressources
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600">
                <Trophy className="w-4 h-4" />
                Succès
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-purple-600">
                <MessageCircle className="w-4 h-4" />
                Support
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop menu */}
      <div className="hidden sm:block">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap gap-2">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800`}
                href="/"
              >
                <Home className="w-5 h-5 mr-2" />
                Accueil
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Programmes */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Target className="w-5 h-5 mr-2" />
                Programmes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex flex-col justify-end h-full w-full rounded-md p-6 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-800/40 dark:to-purple-800 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-700/40 dark:hover:to-purple-700 transition"
                        href="/"
                      >
                        <Target className="h-8 w-8 text-purple-500" />
                        <div className="mt-4 mb-2 text-lg font-medium text-gray-900 dark:text-white">
                          Programmes Personnalisés
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Coaching adapté à vos objectifs
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {[
                    {
                      title: "Développement Personnel",
                      icon: <TrendingUp className="w-4 h-4 mr-2 text-green-500" />,
                      desc: "Confiance, gestion du stress, etc.",
                    },
                    {
                      title: "Coaching Pro",
                      icon: <Zap className="w-4 h-4 mr-2 text-yellow-500" />,
                      desc: "Leadership, carrière, productivité",
                    },
                    {
                      title: "Bien-être & Santé",
                      icon: <Heart className="w-4 h-4 mr-2 text-red-500" />,
                      desc: "Équilibre, nutrition, fitness",
                    },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                        >
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            {item.icon}
                            {item.title}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.desc}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* IA & Méthodes */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800">
                <Brain className="w-5 h-5 mr-2" />
                IA & Méthodes
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[500px] gap-3 p-4 grid-cols-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md">
                  {[
                    {
                      title: "Coach IA Personnel",
                      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
                      desc: "Assistant intelligent 24/7",
                    },
                    {
                      title: "Analyse Comportementale",
                      icon: <Search className="w-4 h-4 text-blue-500" />,
                      desc: "Compréhension des habitudes",
                    },
                    {
                      title: "Suivi personnalisé",
                      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
                      desc: "Suivi dynamique",
                    },
                    {
                      title: "Méthodes Validées",
                      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
                      desc: "Basé sur la science",
                    },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <NavigationMenuLink asChild>
                        <a
                          className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                          href="#"
                        >
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            {item.icon}
                            <span className="ml-2">{item.title}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.desc}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Autres liens directs */}
            {[
              { title: "Ressources", icon: <BookOpen />, href: "#" },
              { title: "Succès", icon: <Trophy />, href: "#" },
              { title: "Support", icon: <MessageCircle />, href: "#" },
            ].map((item, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800`}
                  href={item.href}
                >
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navigation;
