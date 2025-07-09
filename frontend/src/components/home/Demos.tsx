import { Brain, Target, TrendingUp } from "lucide-react";
const Demos = () => {
  return (
       <div className="px-6 py-12 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Fonctionnalités principales
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                IA Personnalisée
              </h3>
              <p className="text-muted-foreground">
                Un coach intelligent qui s'adapte à vos besoins et votre rythme
                d'apprentissage
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                Objectifs Clairs
              </h3>
              <p className="text-muted-foreground">
                Définition et suivi d'objectifs SMART avec des étapes concrètes
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                Suivi Progression
              </h3>
              <p className="text-muted-foreground">
                Tableaux de bord détaillés pour visualiser vos progrès en temps
                réel
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Demos
