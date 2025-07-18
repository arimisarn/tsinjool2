"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";

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

interface Step {
  id: number;
  title: string;
  description: string;
  duration: number;
  type: string;
  completed: boolean;
  instructions: string[];
  exercises: Exercise[];
  progress: number;
}

export default function StepDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stepId } = useParams();
  const [step, setStep] = useState<Step | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [scheduledTime, setScheduledTime] = useState("09:00");

  useEffect(() => {
    document.title = "Tsinjool - Détail de l'étape";
    loadStepData();
  }, [stepId]);

  const loadStepData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      if (location.state?.step) {
        setStep(location.state.step);
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://tsinjool-backend.onrender.com/api/steps/${stepId}/`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setStep(response.data);
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors du chargement de l'étape.");
      window.dispatchEvent(new Event("refresh-notifications"));
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleStartExercise = (exercise: Exercise) => {
    navigate(`/exercise/${exercise.id}`, {
      state: {
        exercise,
        stepId: step?.id,
        stepTitle: step?.title,
      },
    });
  };

  const handleScheduleExercise = async () => {
    if (!scheduledDate) {
      toast.error("Veuillez choisir une date.");
      return;
    }

    if (!selectedExercise) {
      toast.error("Aucun exercice sélectionné.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      const year = scheduledDate.getFullYear();
      const month = String(scheduledDate.getMonth() + 1).padStart(2, "0");
      const day = String(scheduledDate.getDate()).padStart(2, "0");

      const plannedDatetime = `${year}-${month}-${day} ${scheduledTime}:00`;

      await axios.post(
        "https://tsinjool-backend.onrender.com/api/plan-exercise/",
        {
          exercise_id: selectedExercise.id,
          planned_datetime: plannedDatetime,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      toast.success("Exercice planifié avec succès !");
      setShowScheduler(false);
      setScheduledDate(undefined);
      setScheduledTime("09:00");

      window.dispatchEvent(new Event("refresh-notifications"));
    } catch (error) {
      console.error("Erreur planification exercice", error);
      toast.error("Erreur lors de la planification.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Chargement de l'étape...</p>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Étape non trouvée.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case "meditation":
        return <Target className="w-5 h-5" />;
      case "reflection":
        return <BookOpen className="w-5 h-5" />;
      case "practice":
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getExerciseColor = (type: string) => {
    switch (type) {
      case "meditation":
        return "from-green-400 to-teal-500";
      case "reflection":
        return "from-blue-400 to-indigo-500";
      case "practice":
        return "from-purple-400 to-pink-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-800 shadow-sm border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.exercises.length} exercices disponibles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Progression
                </p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(step.progress)}%
                </p>
              </div>

              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                {step.completed ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Target className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Liste Exercices */}
          <div className="col-span-12 md:col-span-4">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-zinc-700 h-full">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Exercices
              </h2>
              <div className="space-y-3 max-h-[75vh] overflow-y-auto">
                {step.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    onClick={() => handleExerciseSelect(exercise)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedExercise?.id === exercise.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                        : exercise.completed
                        ? "border-green-200 bg-green-50 dark:bg-green-900/30"
                        : "border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getExerciseColor(
                            exercise.type
                          )} flex items-center justify-center text-white`}
                        >
                          {exercise.completed ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            getExerciseIcon(exercise.type)
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            Exercice {index + 1}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {exercise.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {exercise.duration}min
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Détails exercice + vidéos recommandées */}
          <div className="col-span-12 md:col-span-8 grid grid-cols-12 gap-6">
            {/* Détail exercice */}
            <div className="col-span-12 lg:col-span-8 bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-zinc-700 overflow-auto max-h-[75vh]">
              {selectedExercise ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedExercise.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedExercise.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Clock className="w-4 h-4" />
                        {selectedExercise.duration} minutes
                      </div>
                      {selectedExercise.completed && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Terminé</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Animation personnage */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/30 rounded-xl p-8 mb-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">
                        {selectedExercise.animation_character}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Votre coach virtuel vous guidera pendant cet exercice
                    </p>
                  </div>

                  {/* Instructions */}
                  {selectedExercise.instructions &&
                    selectedExercise.instructions.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                          Instructions
                        </h3>
                        <div className="space-y-2">
                          {selectedExercise.instructions.map(
                            (instruction, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                    {index + 1}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {instruction}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Bouton démarrer */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleStartExercise(selectedExercise)}
                      disabled={selectedExercise.completed}
                      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                        selectedExercise.completed
                          ? "bg-green-100 text-green-700 cursor-not-allowed dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      }`}
                    >
                      {selectedExercise.completed ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Exercice terminé
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Commencer l'exercice
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Sélectionnez un exercice
                  </h3>
                  <p>
                    Choisissez un exercice dans la liste pour voir les détails
                    et commencer
                  </p>
                </div>
              )}
            </div>

            {/* Vidéos recommandées */}
            {selectedExercise?.recommended_videos &&
              selectedExercise.recommended_videos.length > 0 && (
                <div className="col-span-12 lg:col-span-4">
                  <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-zinc-700 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Vidéos recommandées
                    </h3>
                    {selectedExercise.recommended_videos.map((url, index) => {
                      const videoId = new URL(url).searchParams.get("v");
                      return (
                        <div
                          key={index}
                          className="aspect-video rounded-xl overflow-hidden shadow cursor-pointer hover:scale-[1.02] transition-transform"
                          onClick={() => window.open(url, "_blank")}
                        >
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`Vidéo ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      );
                    })}

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowScheduler(true)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition"
                      >
                        Planifier cet exercice
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Modal planification */}
      {showScheduler && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-[90%] max-w-md shadow-xl border border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Planifier l'exercice
            </h2>

            <Calendar
              mode="single"
              selected={scheduledDate}
              onSelect={setScheduledDate}
              className="mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Heure
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 mb-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleScheduleExercise}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
