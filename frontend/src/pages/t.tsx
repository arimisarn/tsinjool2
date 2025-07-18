//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900">
//       {/* Header avec toggle dark mode */}
//       <div className="flex justify-end p-6">
//         <button
//           onClick={toggleDarkMode}
//           className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
//         >
//           {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="px-6 pb-8">
//         <div className="max-w-[1280px] mx-auto">
//           {/* Titre et description */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               Tableau de bord
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300">
//               Voici votre parcours personnalisé de {getCoachingTypeLabel(userProfile?.coaching_type)}
//             </p>
//           </div>

//           {/* Progress Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
//                   <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Étapes complétées
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {steps.filter((s) => s.completed).length}/{steps.length}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
//                   <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Exercices réalisés
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {steps.reduce((acc, step) => acc + step.exercises.filter((e) => e.completed).length, 0)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
//                   <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Temps total
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {steps.reduce((acc, step) => acc + step.exercises.reduce((exerciseAcc, exercise) => exerciseAcc + exercise.duration, 0), 0)} min
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Coaching Steps */}
//           <div className="mb-8">
//             <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
//               Votre parcours de coaching
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {steps.map((step, index) => (
//                 <div
//                   key={step.id}
//                   className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer group"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
//                         step.completed
//                           ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
//                           : "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
//                       }`}
//                       >
//                         {step.completed ? (
//                           <CheckCircle className="w-6 h-6" />
//                         ) : (
//                           getStepIcon(index)
//                         )}
//                       </div>
//                       <div>
//                         <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
//                           {step.title}
//                         </h4>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {step.exercises.length} exercices
//                         </p>
//                       </div>
//                     </div>
//                     <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
//                   </div>

//                   <p className="text-gray-600 dark:text-gray-400 mb-4">
//                     {step.description}
//                   </p>

//                   {/* Progress Bar */}
//                   <div className="mb-4">
//                     <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
//                       <span>Progression</span>
//                       <span>{Math.round(step.progress)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full transition-all duration-300 ${
//                           step.completed ? "bg-green-500" : "bg-purple-500"
//                         }`}
//                         style={{ width: `${step.progress}%` }}
//                       />
//                     </div>
//                   </div>

//                   {/* Exercise Preview */}
//                   <div className="flex gap-2">
//                     {step.exercises.slice(0, 3).map((exercise) => (
//                       <div
//                         key={exercise.id}
//                         className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
//                           exercise.completed
//                             ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
//                             : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400"
//                         }`}
//                       >
//                         {exercise.completed ? (
//                           <CheckCircle className="w-4 h-4" />
//                         ) : (
//                           <Play className="w-3 h-3" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
//               Actions rapides
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <button className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-xl transition-colors">
//                 <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//                 <span className="font-medium text-purple-900 dark:text-purple-300">
//                   Continuer le parcours
//                 </span>
//               </button>

//               <button className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-xl transition-colors">
//                 <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 <span className="font-medium text-blue-900 dark:text-blue-300">
//                   Voir mes progrès
//                 </span>
//               </button>

//               <button className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-xl transition-colors">
//                 <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
//                 <span className="font-medium text-gray-900 dark:text-gray-300">
//                   Modifier le profil
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
