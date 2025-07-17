import { Brain, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const cards = [
  {
    icon: <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
    bg: "bg-purple-100 dark:bg-purple-900/30",
    title: "IA Personnalisée",
    desc: "Un coach intelligent qui s'adapte à vos besoins et votre rythme d'apprentissage",
  },
  {
    icon: <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    title: "Objectifs Clairs",
    desc: "Définition et suivi d'objectifs SMART avec des étapes concrètes",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />,
    bg: "bg-green-100 dark:bg-green-900/30",
    title: "Suivi Progression",
    desc: "Tableaux de bord détaillés pour visualiser vos progrès en temps réel",
  },
];

const Demos = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden px-6 py-16 bg-muted/30 dark:bg-background transition-colors duration-500">
      {/* Effet décoratif en arrière-plan avec blur */}
      <div
        aria-hidden="true"
        className="absolute top-[-80px] -left-40 w-[500px] h-[500px] rounded-full
                   bg-gradient-to-tr from-purple-300/20 to-blue-300/10
                   dark:from-purple-900/10 dark:to-blue-900/10
                   blur-3xl opacity-70 z-0 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12 text-foreground"
        >
          Fonctionnalités principales
        </motion.h2>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            {cards.map((card, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
              >
                <div
                  className={`${card.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                  {card.title}
                </h3>
                <p className="text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Demos;
