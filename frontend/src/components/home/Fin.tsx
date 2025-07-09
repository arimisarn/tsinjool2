
const Fin = () => {
  return (
     <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Prêt à commencer ?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Commencer maintenant
            </button>
            <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all duration-300">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
  )
}

export default Fin
