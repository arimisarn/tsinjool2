"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Trophy, Heart, Sparkles } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
  console.log(showCelebration, exerciseId);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900 text-gray-900 dark:text-gray-100 p-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {/* Image animée */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {exercise.image_url && (
          <img
            src={exercise.image_url}
            alt="Exercice"
            className="w-full h-80 object-cover"
          />
        )}
      </motion.div>

      {/* Timer et Animation */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center">
        <div className="text-6xl mb-2">{getCharacterAnimation()}</div>
        <div className="text-5xl font-bold mb-2">{formatTime(timeLeft)}</div>
        <p className="text-lg mb-4 text-center">{getEncouragementMessage()}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {!isCompleted &&
            (!isRunning ? (
              <button
                onClick={handleStart}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
              >
                <Play className="inline w-4 h-4 mr-1" /> Commencer
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
              >
                <Pause className="inline w-4 h-4 mr-1" /> Pause
              </button>
            ))}
          <button
            onClick={handleReset}
            className="bg-gray-300 px-4 py-2 rounded-xl"
          >
            <RotateCcw className="inline w-4 h-4 mr-1" /> Reset
          </button>
          {isCompleted && (
            <button
              onClick={() => navigate(-1)}
              className="bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              <Trophy className="inline w-4 h-4 mr-1" /> Retour
            </button>
          )}
        </div>
      </div>

      {/* Instructions + Conseils */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold">Étapes à suivre</h3>
        <ul className="space-y-2">
          {exercise.instructions.map((inst, idx) => (
            <li key={idx} className="text-gray-700 dark:text-gray-300">
              {idx + 1}. {inst}
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <h4 className="text-lg font-medium">Conseils</h4>
        <ul className="space-y-2">
          <li>
            <Heart className="inline w-4 h-4 text-red-500 mr-1" /> Respirez
            profondément
          </li>
          <li>
            <Sparkles className="inline w-4 h-4 text-yellow-500 mr-1" /> Soyez
            présent(e)
          </li>
          <li>
            <Trophy className="inline w-4 h-4 text-blue-500 mr-1" /> Petit à
            petit
          </li>
        </ul>
      </div>

      {/* Vidéos recommandées */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold">Vidéos recommandées</h3>
        <div className="space-y-4">
          {exercise.recommended_videos?.length ? (
            exercise.recommended_videos.map((url, idx) => (
              <div key={idx} className="aspect-video">
                <iframe
                  src={url.replace("watch?v=", "embed/")}
                  title={`video-${idx}`}
                  className="w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucune vidéo recommandée.</p>
          )}
        </div>
      </div>
    </div>
  );
}
