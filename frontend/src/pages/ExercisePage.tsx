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
        `https://tsinjool-backend.onrender.com/api/exercises/${exerciseId}/complete/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      toast.success("Félicitations ! Exercice terminé avec succès !");
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement de l'exercice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4 animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Félicitations !
            </h2>
            <p className="text-gray-600 mb-4">
              Vous avez terminé l'exercice avec succès !
            </p>
            <div className="flex justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
              <Star className="w-6 h-6 text-yellow-500 fill-current" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {exercise.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {location.state?.stepTitle &&
                    `${location.state.stepTitle} • `}
                  {exercise.duration} minutes
                </p>
              </div>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Terminé</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Character and Timer Section */}
          <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-16 w-16 h-16 bg-white/5 rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-white/15 rounded-full animate-pulse delay-700" />
            </div>

            <div className="relative z-10">
              {/* Character */}
              <div className="text-8xl mb-4 animate-bounce">
                {getCharacterAnimation()}
              </div>

              {/* Timer */}
              <div className="mb-6">
                <div className="text-6xl font-bold mb-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xl opacity-90">
                  {getEncouragementMessage()}
                </p>
              </div>

              {/* Progress Circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 50 * (1 - getProgressPercentage() / 100)
                    }`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {Math.round(getProgressPercentage())}%
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center gap-4">
                {!isCompleted && (
                  <>
                    {!isRunning ? (
                      <button
                        onClick={handleStart}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Play className="w-5 h-5" />
                        {timeLeft === exercise.duration * 60
                          ? "Commencer"
                          : "Reprendre"}
                      </button>
                    ) : (
                      <button
                        onClick={handlePause}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <Pause className="w-5 h-5" />
                        Pause
                      </button>
                    )}

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-6 py-4 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-200"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </button>
                  </>
                )}
                <button
                  onClick={handleExerciseComplete}
                  className="flex items-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5" />
                  Terminer maintenant
                </button>
                {isCompleted && (
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Trophy className="w-5 h-5" />
                    Retour aux exercices
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Instructions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Étapes à suivre
                </h4>
                <div className="space-y-3">
                  {exercise.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Conseils
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-gray-700">
                      Respirez profondément et restez détendu(e)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <p className="text-gray-700">
                      Concentrez-vous sur le moment présent
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-blue-500 mt-0.5" />
                    <p className="text-gray-700">Chaque petit progrès compte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                À propos de cet exercice
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {exercise.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
