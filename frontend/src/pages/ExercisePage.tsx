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
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";

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
    document.title = "Enhanced Exercise Page Design";

    // Récupérer l'exercice depuis location.state
    if (location.state?.exercise) {
      const exerciseData = location.state.exercise;
      setExercise(exerciseData);
      setTimeLeft(exerciseData.duration * 60); // Convertir en secondes
    } else {
      // For demo purposes, create a sample exercise
      const sampleExercise = {
        id: 1,
        title: "Méditation de pleine conscience",
        description:
          "Un exercice de méditation guidée pour développer votre attention et réduire le stress. Cette pratique vous aidera à vous reconnecter avec le moment présent.",
        duration: 10,
        type: "meditation",
        completed: false,
        instructions: [
          "Installez-vous confortablement dans un endroit calme",
          "Fermez les yeux et concentrez-vous sur votre respiration",
          "Observez vos pensées sans les juger",
          "Revenez doucement à votre respiration quand votre esprit divague",
        ],
        animation_character: "🧘‍♀️",
        image_url:
          "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800",
      };
      setExercise(sampleExercise);
      setTimeLeft(sampleExercise.duration * 60);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [location.state]);

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

    // Simulate API call for demo
    console.log("Exercise completed:", exercise?.id);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Chargement de l'exercice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-slate-200/40 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-300/40 rounded-full animate-bounce"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl p-12 text-center max-w-md mx-4 animate-scale-in shadow-2xl">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Fantastique !
            </h2>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fantastique !
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Vous avez terminé l'exercice avec succès !
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
            <div className="text-gray-500 text-sm">
              Progression sauvegardée automatiquement
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10">
        <div className="backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
          <div className="w-full px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate(-1)}
                  className="group p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {exercise.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
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
                  </div>
                </div>
              </div>

              {isCompleted && (
                <div className="flex items-center gap-3 px-4 py-2 bg-green-100 border border-green-200 rounded-xl text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Terminé</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
              {/* Left Column - Timer & Character */}
              <div className="flex flex-col">
                <div className="flex-1 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-3xl p-8 text-gray-900 text-center relative overflow-hidden shadow-xl">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59,130,246,0.1) 0%, transparent 50%),
                                       radial-gradient(circle at 75% 75%, rgba(99,102,241,0.1) 0%, transparent 50%)`,
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
                            className="rounded-2xl shadow-2xl mx-auto max-h-64 object-cover border-2 border-gray-200"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent rounded-2xl" />
                        </div>
                        <p className="mt-3 text-sm text-gray-500 italic">
                          Image illustrative générée automatiquement
                        </p>
                      </div>
                    )}

                    {/* Character */}
                    <div className="text-9xl mb-6 transform transition-all duration-300 hover:scale-110">
                      {getCharacterAnimation()}
                    </div>

                    {/* Timer */}
                    <div className="mb-8">
                      <div className="text-7xl font-bold mb-4 font-mono tracking-tight">
                        {formatTime(timeLeft)}
                      </div>
                      <p className="text-xl text-gray-700 max-w-md mx-auto leading-relaxed">
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
                          stroke="rgba(156,163,175,0.3)"
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
                            2 *
                            Math.PI *
                            70 *
                            (1 - getProgressPercentage() / 100)
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
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="50%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#6366F1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-1">
                            {Math.round(getProgressPercentage())}%
                          </div>
                          <div className="text-sm text-gray-500">
                            Progression
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4 w-full">
                      {!isCompleted && (
                        <>
                          {!isRunning ? (
                            <button
                              onClick={handleStart}
                              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                              <Play className="w-6 h-6 transition-transform group-hover:scale-110" />
                              {timeLeft === exercise.duration * 60
                                ? "Commencer"
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
                            className="group flex items-center gap-3 px-6 py-4 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                          >
                            <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-180" />
                            Reset
                          </button>
                        </>
                      )}

                      <button
                        onClick={handleExerciseComplete}
                        className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <CheckCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                        Terminer maintenant
                      </button>

                      {isCompleted && (
                        <button
                          onClick={() => navigate(-1)}
                          className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-3xl p-8 flex-1 shadow-xl">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-blue-500" />
                    Instructions
                  </h3>

                  <div className="space-y-8">
                    {/* Steps */}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        Étapes à suivre
                      </h4>
                      <div className="space-y-4">
                        {exercise.instructions.map((instruction, index) => (
                          <div
                            key={index}
                            className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-white">
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed pt-1">
                              {instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Conseils
                      </h4>
                      <div className="space-y-4">
                        <div className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200">
                          <Heart className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">
                            Respirez profondément et restez détendu(e)
                          </p>
                        </div>
                        <div className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200">
                          <Sparkles className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">
                            Concentrez-vous sur le moment présent
                          </p>
                        </div>
                        <div className="group flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200">
                          <Trophy className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">
                            Chaque petit progrès compte
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-3xl p-8 shadow-xl">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />À propos de cet
                    exercice
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {exercise.description}
                  </p>
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
