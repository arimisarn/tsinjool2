"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Star,
  Trophy,
  Heart,
  Sparkles,
  Clock,
  Brain,
  Focus,
  Zap,
  Award,
  Target,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface Exercise {
  id: number;
  title: string;
  description: string;
  duration: number;
  type: string;
  completed: boolean;
  instructions: string[];
  animation_character: string;
  recommended_videos?: string[];
  image_url?: string;
  coach_tips?: string[];
}

export default function ExercisePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  console.log(exerciseId);

  useEffect(() => {
    document.title = "Tsinjool - Exercice en cours";

    // Récupérer l'exercice depuis location.state
    if (location.state?.exercise) {
      const exerciseData = location.state.exercise;
      setExercise(exerciseData);
      setTimeLeft(exerciseData.duration * 60); // Convertir en secondes
    } else {
      toast.error("Exercice non trouvé.");
      navigate("/dashboard");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [location.state, navigate]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(exercise ? exercise.duration * 60 : 0);
    setIsCompleted(false);
  };

  const handleExerciseComplete = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); 
    }

    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(true);
    setShowCelebration(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://backend-tsinjool.onrender.com/api/exercises/${exercise?.id}/complete/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      toast.success("Félicitations ! Exercice terminé avec succès !");
      window.dispatchEvent(new Event("refresh-notifications"));
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement de la progression.");
    }

    // 🎉 Masquer la célébration après 3 secondes
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (!exercise) return 0;
    const totalSeconds = exercise.duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getCharacterAnimation = () => {
    if (isCompleted) return "🎉";
    if (isRunning) return "🧘‍♀️";
    return exercise?.animation_character || "🤖";
  };

  const getEncouragementMessage = () => {
    const progress = getProgressPercentage();
    if (isCompleted) return "Fantastique ! Vous avez terminé l'exercice !";
    if (progress > 75) return "Presque fini ! Continuez comme ça !";
    if (progress > 50) return "Excellent travail ! Vous êtes à mi-chemin !";
    if (progress > 25) return "Très bien ! Restez concentré(e) !";
    if (isRunning) return "C'est parti ! Prenez votre temps et respirez.";
    return "Prêt(e) à commencer ? Cliquez sur play !";
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-ping opacity-75 mx-auto"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            Chargement de votre session IA...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full animate-bounce opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 rounded-3xl p-6 sm:p-12 text-center max-w-md w-full animate-scale-in shadow-2xl">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce">
              🎉
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Mission Accomplie !
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-base sm:text-lg">
              Votre coach IA est fier de vos progrès !
            </p>
            <div className="flex justify-center gap-2 mb-4 sm:mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-current animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Progression sauvegardée automatiquement
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10">
        <div className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700">
          <div className="w-full px-2 sm:px-4">
            <div className="flex items-center justify-between py-4 sm:py-6">
              <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
                <button
                  onClick={() => window.history.back()}
                  className="group p-2 sm:p-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-xl transition-all duration-200 flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 truncate">
                    {exercise.title}
                  </h1>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {exercise.duration} min
                    </span>
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                      Session IA
                    </span>
                  </div>
                </div>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-700 dark:text-emerald-400 flex-shrink-0">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-semibold text-xs sm:text-sm">
                    Terminé
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Timer & Character */}
            <div className="flex flex-col order-2 xl:order-1">
              <div className="flex-1 bg-white/70 dark:bg-zinc-900/90 border dark:border-zinc-800 border-white/20 dark:border-zinc-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center relative overflow-hidden shadow-xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                                     radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)`,
                    }}
                  />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Exercise Image */}
                  {exercise.image_url && (
                    <div className="mb-4 sm:mb-8">
                      <div className="relative">
                        <img
                          src={exercise.image_url}
                          alt={`Illustration pour ${exercise.title}`}
                          className="rounded-xl sm:rounded-2xl shadow-2xl mx-auto max-h-32 sm:max-h-48 lg:max-h-64 w-full object-cover border-2 border-indigo-200 dark:border-zinc-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl sm:rounded-2xl" />
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1 sm:p-2">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                        </div>
                      </div>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
                        Illustration générée par IA
                      </p>
                    </div>
                  )}

                  {/* Character */}
                  <div className="relative mb-4 sm:mb-6">
                    <div className="text-6xl sm:text-7xl lg:text-9xl transform transition-all duration-300 hover:scale-110">
                      {getCharacterAnimation()}
                    </div>
                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="mb-4 sm:mb-8">
                    <div className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4 font-mono tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-sm sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed font-medium px-2">
                      {getEncouragementMessage()}
                    </p>
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-4 sm:mb-8">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 160 160"
                    >
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="rgba(99, 102, 241, 0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 70 * (1 - getProgressPercentage() / 100)
                        }`}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#6366F1" />
                          <stop offset="50%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                          {Math.round(getProgressPercentage())}%
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Progression
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 w-full">
                    {!isCompleted && (
                      <>
                        {!isRunning ? (
                          <button
                            onClick={handleStart}
                            className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                          >
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                            <span className="hidden sm:inline">
                              {timeLeft === exercise.duration * 60
                                ? "Commencer la session"
                                : "Reprendre"}
                            </span>
                            <span className="sm:hidden">
                              {timeLeft === exercise.duration * 60
                                ? "Commencer"
                                : "Reprendre"}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={handlePause}
                            className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                          >
                            <Pause className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                            Pause
                          </button>
                        )}

                        <button
                          onClick={handleReset}
                          className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-indigo-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 text-sm sm:text-base"
                        >
                          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-180" />
                          Réinitialiser
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleExerciseComplete}
                      className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                    >
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                      <span className="hidden sm:inline">
                        Terminer maintenant
                      </span>
                      <span className="sm:hidden">Terminer</span>
                    </button>

                    {isCompleted && (
                      <button
                        onClick={() => window.history.back()}
                        className="group flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                      >
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                        <span className="hidden sm:inline">
                          Retour aux exercices
                        </span>
                        <span className="sm:hidden">Retour</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Instructions */}
            <div className="flex flex-col gap-4 sm:gap-6 order-1 xl:order-2">
              {/* Instructions Section */}
              <div className="bg-white/70 dark:bg-zinc-900/90 dark:border-zinc-800 border border-white/20 dark:border-zinc-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 flex-1 shadow-xl">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <span className="text-lg sm:text-xl lg:text-3xl">
                    Guide IA Personnalisé
                  </span>
                </h3>

                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Steps */}
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      Étapes recommandées par l'IA
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      {exercise.instructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-zinc-800/20 dark:to-zinc-700/20 rounded-xl border border-indigo-200 dark:border-zinc-700 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-zinc-800/30 dark:hover:to-zinc-700/30 transition-all duration-200"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed pt-1 font-medium">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  {/* <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      Conseils de votre coach IA
                    </h4>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-700 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30 transition-all duration-200">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Respirez profondément et restez détendu(e)
                        </p>
                      </div>
                      <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-800/20 dark:to-yellow-800/20 rounded-xl border border-amber-200 dark:border-amber-700 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 transition-all duration-200">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                          <Focus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Concentrez-vous sur le moment présent
                        </p>
                      </div>
                      <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-800/20 dark:to-teal-800/20 rounded-xl border border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all duration-200">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Chaque petit progrès compte dans votre parcours
                        </p>
                      </div>
                    </div>
                  </div> */}
                  {/* Tips */}
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      Conseils de votre coach IA
                    </h4>

                    <div className="space-y-3 sm:space-y-4">
                      {exercise.coach_tips && exercise.coach_tips.length > 0 ? (
                        exercise.coach_tips.map((tip, index) => {
                          // Couleurs et icônes cycliques comme dans ton code statique (3 styles)
                          const bgFromTo =
                            index % 3 === 0
                              ? "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20"
                              : index % 3 === 1
                              ? "from-amber-50 to-yellow-50 dark:from-amber-800/20 dark:to-yellow-800/20"
                              : "from-emerald-50 to-teal-50 dark:from-emerald-800/20 dark:to-teal-800/20";

                          const borderColor =
                            index % 3 === 0
                              ? "border-rose-200 dark:border-rose-700"
                              : index % 3 === 1
                              ? "border-amber-200 dark:border-amber-700"
                              : "border-emerald-200 dark:border-emerald-700";

                          const hoverFromTo =
                            index % 3 === 0
                              ? "hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30"
                              : index % 3 === 1
                              ? "hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30"
                              : "hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30";

                          const iconBg =
                            index % 3 === 0
                              ? "from-rose-500 to-pink-500"
                              : index % 3 === 1
                              ? "from-amber-500 to-yellow-500"
                              : "from-emerald-500 to-teal-500";

                          const Icon =
                            index % 3 === 0
                              ? Heart
                              : index % 3 === 1
                              ? Focus
                              : Award;

                          return (
                            <div
                              key={index}
                              className={`group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r ${bgFromTo} rounded-xl border ${borderColor} ${hoverFromTo} transition-all duration-200`}
                            >
                              <div
                                className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${iconBg} rounded-lg flex items-center justify-center`}
                              >
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                {tip}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          Pas de conseils disponibles.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/70 dark:bg-zinc-900/90 dark:border-zinc-800 border border-white/20 dark:border-zinc-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  À propos de cette session
                </h4>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {exercise.description}
                </p>
                <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                  <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">
                    Exercice optimisé par intelligence artificielle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
