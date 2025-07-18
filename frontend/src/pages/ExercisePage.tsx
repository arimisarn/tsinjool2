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

    if (location.state?.exercise) {
      const exerciseData = location.state.exercise;
      setExercise(exerciseData);
      setTimeLeft(exerciseData.duration * 60);
    } else {
      toast.error("Exercice non trouvé.");
      navigate("/dashboard");
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(exercise ? exercise.duration * 60 : 0);
    setIsCompleted(false);
  };

  const handleExerciseComplete = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(true);
    setShowCelebration(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://tsinjool-backend.onrender.com/api/exercises/${exercise?.id}/complete/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );
      toast.success("Félicitations ! Exercice terminé avec succès !");
      window.dispatchEvent(new Event("refresh-notifications"));
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement.");
    }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 text-gray-900 dark:text-gray-100">
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl text-center shadow-xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Bravo !</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Vous avez terminé l'exercice !
            </p>
            <div className="flex justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{exercise.title}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {location.state?.stepTitle && `${location.state.stepTitle} • `}
                {exercise.duration} minutes
              </p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Terminé</span>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Image et Timer */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 sm:p-10 text-white text-center relative">
            {exercise.image_url && (
              <div className="mb-6">
                <img
                  src={exercise.image_url}
                  alt={exercise.title}
                  className="w-full h-64 sm:h-80 object-cover rounded-xl border-4 border-white shadow-lg"
                />
              </div>
            )}

            <div className="text-7xl mb-4">{getCharacterAnimation()}</div>
            <div className="text-5xl font-bold mb-2">
              {formatTime(timeLeft)}
            </div>
            <p className="text-lg opacity-90 mb-4">
              {getEncouragementMessage()}
            </p>

            {/* Barre de progression circulaire */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
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

            {/* Boutons de contrôle */}
            <div className="flex flex-wrap justify-center gap-4">
              {!isCompleted && (
                <>
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                    >
                      <Play className="inline w-5 h-5 mr-2" />
                      {timeLeft === exercise.duration * 60
                        ? "Commencer"
                        : "Reprendre"}
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                    >
                      <Pause className="inline w-5 h-5 mr-2" />
                      Pause
                    </button>
                  )}

                  <button
                    onClick={handleReset}
                    className="bg-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition"
                  >
                    <RotateCcw className="inline w-5 h-5 mr-2" />
                    Réinitialiser
                  </button>
                </>
              )}

              <button
                onClick={handleExerciseComplete}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                <CheckCircle className="inline w-5 h-5 mr-2" />
                Terminer maintenant
              </button>

              {isCompleted && (
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  <Trophy className="inline w-5 h-5 mr-2" />
                  Retour
                </button>
              )}
            </div>
          </div>

          {/* Instructions & Description */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Étapes à suivre</h3>
                <ul className="space-y-3">
                  {exercise.instructions.map((inst, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 font-bold rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{inst}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Conseils</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <Heart className="text-red-500 w-5 h-5 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">
                      Respirez profondément et restez détendu(e)
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <Sparkles className="text-yellow-500 w-5 h-5 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">
                      Concentrez-vous sur le moment présent
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <Trophy className="text-blue-500 w-5 h-5 mt-1" />
                    <p className="text-gray-700 dark:text-gray-300">
                      Chaque petit progrès compte
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-700 rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-3">
                À propos de cet exercice
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {exercise.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
