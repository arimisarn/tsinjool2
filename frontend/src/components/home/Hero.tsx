import { BookOpen, Play, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const Hero = () => {
  const [loading, setLoading] = useState(true);

  // Simulation du chargement
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-12 bg-background transition-colors duration-500">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto rounded-full" />
          <Skeleton className="h-12 w-[80%] mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="flex justify-center gap-4 mt-6">
            <Skeleton className="h-12 w-48 rounded-lg" />
            <Skeleton className="h-12 w-48 rounded-lg" />
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 bg-background transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Nouveau : IA Tsinjo 2.0 disponible
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-bold mb-6 text-foreground"
        >
          Transformez votre vie avec un{" "}
          <span className="bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">
            Coach IA Personnel
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-xl mb-8 text-muted-foreground"
        >
          Atteignez vos objectifs plus rapidement avec un accompagnement
          personnalisé disponible 24/7
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Essayer gratuitement
          </button>
          <button className="px-8 py-4 rounded-lg font-semibold text-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Découvrir comment ça marche
          </button>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.4,
                staggerChildren: 0.2,
              },
            },
          }}
          className="flex items-center justify-center gap-8 mt-12 flex-wrap"
        >
          {[
            "14 jours gratuits",
            "Aucune carte requise",
            "Résultats garantis",
          ].map((text, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
