import { motion } from "framer-motion";

const Fin = () => {
  return (
    <div className="relative overflow-hidden px-6 py-16 bg-muted/30 dark:bg-background">
      {/* Fond décoratif flou */}
      <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/10 blur-3xl opacity-60 z-0 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center z-10"
      >
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          Prêt à commencer ?
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            Commencer maintenant
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all duration-300"
          >
            En savoir plus
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Fin;
