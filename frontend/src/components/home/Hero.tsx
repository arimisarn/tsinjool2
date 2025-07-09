import {
  BookOpen,
  Play,
  CheckCircle,
  Sparkles,
} from "lucide-react";
const Hero = () => {
  return (
         <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Nouveau : IA Tsinjo 2.0 disponible
          </div>

          <h1 className="text-5xl font-bold mb-6 text-foreground transition-colors duration-300">
            Transformez votre vie avec un
            <span className="bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Coach IA Personnel
            </span>
          </h1>

          <p className="text-xl mb-8 text-muted-foreground transition-colors duration-300">
            Atteignez vos objectifs plus rapidement avec un accompagnement
            personnalisé disponible 24/7
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Essayer gratuitement
            </button>
            <button className="px-8 py-4 rounded-lg font-semibold text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Découvrir comment ça marche
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                14 jours gratuits
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Aucune carte requise
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Résultats garantis
              </span>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Hero
