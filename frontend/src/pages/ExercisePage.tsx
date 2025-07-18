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
  Target,
  Zap,
  Brain,
  Focus,
  Award,
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
      clearInterval(intervalRef.current); // ⛔️ Arrête le timer
    }

    setIsRunning(false);
    setTimeLeft(0); // 🕒 Force 00:00
    setIsCompleted(true);
    setShowCelebration(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://tsinjool-backend.onrender.com/api/exercises/${exercise?.id}/complete/`,
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-bounce opacity-30"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-12 text-center max-w-md mx-4 animate-scale-in shadow-2xl">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Mission Accomplie !
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
              Votre coach IA est fier de vos progrès !
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 text-yellow-400 fill-current animate-pulse"
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
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-indigo-200 dark:border-indigo-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate(-1)}
                  className="group p-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {exercise.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    {location.state?.stepTitle && (
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {location.state.stepTitle}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {exercise.duration} minutes
                    </span>
                    <span className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Session IA personnalisée
                    </span>
                  </div>
                </div>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-300 dark:border-emerald-700 rounded-xl text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Session terminée</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
            {/* Left Column - Timer & Character */}
            <div className="flex flex-col">
              <div className="flex-1 bg-white/70 dark:bg-gray-900 border dark:border-gray-800 border-white/20 dark:border-gray-700/50 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
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
                    <div className="mb-8">
                      <div className="relative">
                        <img
                          src={exercise.image_url}
                          alt={`Illustration pour ${exercise.title}`}
                          className="rounded-2xl shadow-2xl mx-auto max-h-64 object-cover border-2 border-indigo-200 dark:border-indigo-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic">
                        Illustration générée par IA
                      </p>
                    </div>
                  )}

                  {/* Character */}
                  <div className="relative mb-6">
                    <div className="text-9xl transform transition-all duration-300 hover:scale-110">
                      {getCharacterAnimation()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="mb-8">
                    <div className="text-7xl font-bold mb-4 font-mono tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-xl text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed font-medium">
                      {getEncouragementMessage()}
                    </p>
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-40 h-40 mx-auto mb-8">
                    <svg
                      className="w-40 h-40 transform -rotate-90"
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
                        <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                          {Math.round(getProgressPercentage())}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Progression
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-wrap justify-center gap-4 w-full">
                    {!isCompleted && (
                      <>
                        {!isRunning ? (
                          <button
                            onClick={handleStart}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
                            {timeLeft === exercise.duration * 60
                              ? "Commencer la session"
                              : "Reprendre"}
                          </button>
                        ) : (
                          <button
                            onClick={handlePause}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            <Pause className="w-6 h-6 transition-transform group-hover:scale-110" />
                            Pause
                          </button>
                        )}

                        <button
                          onClick={handleReset}
                          className="group flex items-center gap-3 px-6 py-4 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-indigo-200 dark:border-indigo-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200"
                        >
                          <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
                          Reset
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleExerciseComplete}
                      className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                      Terminer maintenant
                    </button>

                    {isCompleted && (
                      <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Trophy className="w-6 h-6 transition-transform group-hover:scale-110" />
                        Retour aux exercices
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Instructions */}
            <div className="flex flex-col gap-6">
              {/* Instructions Section */}
              <div className="bg-white/70 dark:bg-gray-900 dark:border-gray-800 border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 flex-1 shadow-xl">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  Guide IA Personnalisé
                </h3>

                <div className="space-y-8">
                  {/* Steps */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                      Étapes recommandées par l'IA
                    </h4>
                    <div className="space-y-4">
                      {exercise.instructions.map((instruction, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sm font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1 font-medium">
                            {instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      Conseils de votre coach IA
                    </h4>
                    <div className="space-y-4">
                      <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-700 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30 transition-all duration-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Respirez profondément et restez détendu(e)
                        </p>
                      </div>
                      <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-700 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 transition-all duration-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                          <Focus className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Concentrez-vous sur le moment présent
                        </p>
                      </div>
                      <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 transition-all duration-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          Chaque petit progrès compte dans votre parcours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/70 dark:bg-gray-900 dark:border-gray-800 border border-white/20 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  À propos de cette session
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
                  {exercise.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <Brain className="w-4 h-4" />
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
