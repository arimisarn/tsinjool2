import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Heart,
  Sparkles,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Moon,
  Sun,
} from "lucide-react";

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

const ExercisePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Données d'exemple pour l'exercice
  const [exercise] = useState<Exercise>({
    id: 1,
    title: "Méditation Guidée",
    description:
      "Une séance de méditation pour réduire le stress et améliorer la concentration. Cette pratique vous aidera à vous recentrer et à trouver un moment de calme dans votre journée.",
    duration: 10,
    type: "meditation",
    completed: false,
    instructions: [
      "Installez-vous confortablement dans un endroit calme",
      "Fermez les yeux et concentrez-vous sur votre respiration",
      "Laissez vos pensées passer sans les juger",
      "Revenez doucement à votre respiration si votre esprit s'égare",
      "Terminez en prenant conscience de votre corps et de votre environnement",
    ],
    animation_character: "🧘‍♀️",
    recommended_videos: [
      "https://www.youtube.com/watch?v=ZToicYcHIOU",
      "https://www.youtube.com/watch?v=inpok4MKVLM",
      "https://www.youtube.com/watch?v=U9Q4nAuIrw4",
    ],
    image_url:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  });

  useEffect(() => {
    setTimeLeft(exercise.duration * 60);
  }, [exercise.duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
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

  const handleStart = (): void => setIsRunning(true);
  const handlePause = (): void => setIsRunning(false);
  const handleReset = (): void => {
    setIsRunning(false);
    setTimeLeft(exercise.duration * 60);
    setIsCompleted(false);
  };

  const handleExerciseComplete = (): void => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(0);
    setIsCompleted(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    const totalSeconds = exercise.duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getCharacterAnimation = (): string => {
    if (isCompleted) return "🎉";
    if (isRunning) return "🧘‍♀️";
    return exercise.animation_character;
  };

  const getEncouragementMessage = (): string => {
    const progress = getProgressPercentage();
    if (isCompleted) return "Fantastique ! Vous avez terminé l'exercice !";
    if (progress > 75) return "Presque fini ! Continuez comme ça !";
    if (progress > 50) return "Excellent travail ! Vous êtes à mi-chemin !";
    if (progress > 25) return "Très bien ! Restez concentré(e) !";
    if (isRunning) return "C'est parti ! Prenez votre temps et respirez.";
    return "Prêt(e) à commencer ? Cliquez sur play !";
  };

  const convertYouTubeToEmbed = (url: string): string => {
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    return url;
  };

  const nextVideo = (): void => {
    setCurrentVideoIndex((prev: number) =>
      prev === (exercise.recommended_videos?.length ?? 0) - 1 ? 0 : prev + 1
    );
  };

  const prevVideo = (): void => {
    setCurrentVideoIndex((prev: number) =>
      prev === 0 ? (exercise.recommended_videos?.length ?? 0) - 1 : prev - 1
    );
  };

  const handleBackNavigation = (): void => {
    if (typeof window !== "undefined" && window.history) {
      window.history.back();
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-3xl p-8 text-center max-w-md mx-4 animate-bounce shadow-2xl`}
          >
            <div className="text-6xl mb-4 animate-pulse">🎉</div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Félicitations !
            </h2>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Vous avez terminé l'exercice avec succès !
            </p>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 text-yellow-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  ⭐
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header with Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-white text-gray-600 hover:bg-gray-50"
          } shadow-lg hover:shadow-xl`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Grid Container */}
      <div className="h-screen grid grid-cols-2 grid-rows-2 gap-6 p-6">
        {/* Carré 1: Image animée (Haut Gauche) */}
        <div
          className={`rounded-3xl overflow-hidden shadow-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } relative group`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 z-10" />
          {exercise.image_url && (
            <img
              src={exercise.image_url}
              alt={exercise.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{
                animation: "float 6s ease-in-out infinite",
              }}
            />
          )}
          <div className="absolute bottom-6 left-6 right-6 z-20">
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {exercise.title}
                </h1>
                <p className="text-white/90 text-lg drop-shadow">
                    {exercise.duration} minutes • {exercise.type}
                </p>
          </div>
        </div>

        {/* Carré 2: Timer et Contrôles (Haut Droite) */}
        <div
          className={`rounded-3xl p-8 shadow-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col items-center justify-center relative overflow-hidden`}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-500 rounded-full animate-pulse delay-300" />
          </div>

          <div className="relative z-10 text-center">
            {/* Character Animation */}
            <div
              className="text-8xl mb-6 transition-all duration-500"
              style={{
                animation: isRunning
                  ? "bounce 2s infinite"
                  : "pulse 3s infinite",
              }}
            >
              {getCharacterAnimation()}
            </div>

            {/* Timer */}
            <div
              className={`text-6xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {formatTime(timeLeft)}
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
                  stroke={
                    darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                  }
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 50 * (1 - getProgressPercentage() / 100)
                  }`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
            </div>

            {/* Encouragement Message */}
            <p
              className={`text-lg mb-6 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {getEncouragementMessage()}
            </p>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              {!isCompleted && (
                <>
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Play className="w-5 h-5" />
                      Commencer
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Pause className="w-5 h-5" />
                      Pause
                    </button>
                  )}
                </>
              )}

              <button
                onClick={handleReset}
                className={`flex items-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>

              <button
                onClick={handleExerciseComplete}
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <CheckCircle className="w-5 h-5" />
                Terminer
              </button>

              {isCompleted && (
                <button
                  onClick={handleBackNavigation}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Trophy className="w-5 h-5" />
                  Retour
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carré 3: Instructions et Conseils (Bas Gauche) */}
        <div
          className={`rounded-3xl p-8 shadow-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } overflow-y-auto`}
        >
          <h3
            className={`text-2xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Instructions
          </h3>

          {/* Étapes à suivre */}
          <div className="mb-8">
            <h4
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-purple-300" : "text-purple-600"
              }`}
            >
              Étapes à suivre
            </h4>
            <div className="space-y-4">
              {exercise.instructions.map(
                (instruction: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {instruction}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Conseils */}
          <div className="mb-8">
            <h4
              className={`text-lg font-semibold mb-4 ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Conseils
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Respirez profondément et restez détendu(e)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Concentrez-vous sur le moment présent
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Chaque petit progrès compte
                </p>
              </div>
            </div>
          </div>

          {/* À propos */}
          <div
            className={`rounded-xl p-6 ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <h4
              className={`text-lg font-semibold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              À propos de cet exercice
            </h4>
            <p
              className={`leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {exercise.description}
            </p>
          </div>
        </div>

        {/* Carré 4: Vidéos Recommandées (Bas Droite) */}
        <div
          className={`rounded-3xl p-8 shadow-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } flex flex-col`}
        >
          <h3
            className={`text-2xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Vidéos Recommandées
          </h3>

          {exercise.recommended_videos &&
          exercise.recommended_videos.length > 0 ? (
            <div className="flex-1 flex flex-col">
              {/* Video Player */}
              <div className="flex-1 mb-4">
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={convertYouTubeToEmbed(
                      exercise.recommended_videos[currentVideoIndex]
                    )}
                    title={`Video ${currentVideoIndex + 1}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevVideo}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  disabled={exercise.recommended_videos.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {currentVideoIndex + 1} /{" "}
                    {exercise.recommended_videos.length}
                  </span>
                  <div className="flex gap-1">
                    {exercise.recommended_videos.map((_, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentVideoIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentVideoIndex
                            ? "bg-purple-500 scale-125"
                            : darkMode
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={nextVideo}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  disabled={exercise.recommended_videos.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* External Link */}
              <div className="mt-4 text-center">
                <a
                  href={exercise.recommended_videos[currentVideoIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Voir sur YouTube
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p
                className={`text-center ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Aucune vidéo recommandée pour cet exercice
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default ExercisePage;
