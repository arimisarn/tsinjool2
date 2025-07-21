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
  Zap,
  Brain,
  Calendar as CalendarIcon,
  Sparkles,
  Heart,
  Focus,
  Award,
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
  coach_tips?: string[]; // 🆕 ajouter cette ligne
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto animate-pulse shadow-2xl">
              <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-ping opacity-75 mx-auto"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-lg">
            Chargement de votre parcours...
          </p>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto">
            <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
            Étape non trouvée.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
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
        return <Target className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "reflection":
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "practice":
        return <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getExerciseColor = (type: string) => {
    switch (type) {
      case "meditation":
        return "from-emerald-400 to-teal-500";
      case "reflection":
        return "from-blue-400 to-cyan-500";
      case "practice":
        return "from-violet-400 to-purple-500";
      default:
        return "from-rose-400 to-pink-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 sm:w-48 sm:h-48 bg-pink-500/10 rounded-full animate-pulse delay-2000"></div>

        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full animate-bounce opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="bg-white/70 dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-700">
          <div className="w-full px-2 sm:px-4">
            <div className="flex items-center justify-between py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-2 sm:p-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-xl transition-all duration-200 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                    {step.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">
                      {step.exercises.length} exercices personnalisés
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Progression IA
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${Math.round(step.progress)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round(step.progress)}%
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-2 sm:px-4 py-3 sm:py-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-6">
            {/* Exercise List */}
            <div className="xl:col-span-1 order-2 xl:order-1">
              <div className="bg-white/70 dark:bg-zinc-900 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-3 sm:p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <h2 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Exercices IA
                  </h2>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {step.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      onClick={() => handleExerciseSelect(exercise)}
                      className={`group relative p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        selectedExercise?.id === exercise.id
                          ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400 shadow-lg"
                          : exercise.completed
                          ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400"
                          : "bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${getExerciseColor(
                              exercise.type
                            )} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 flex-shrink-0`}
                          >
                            {exercise.completed ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              getExerciseIcon(exercise.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">
                                Exercice {index + 1}
                              </h3>
                              {exercise.completed && (
                                <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-xs font-medium flex-shrink-0">
                                  Terminé
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {exercise.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1 sm:px-2 py-1 rounded-full flex-shrink-0">
                          <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                          {exercise.duration}min
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exercise Details */}
            <div className="xl:col-span-2 order-1 xl:order-2">
              <div className="bg-white/70 dark:bg-zinc-900/90 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-3 sm:p-6 min-h-[400px] sm:min-h-[600px]">
                {selectedExercise ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"></div>
                      <div className="relative p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                              {selectedExercise.title}
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                              {selectedExercise.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-2 sm:px-3 py-1 sm:py-2 rounded-full flex-shrink-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            {selectedExercise.duration} minutes
                          </div>
                        </div>

                        {/* AI Character */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 rounded-xl p-4 sm:p-6 text-center">
                          <div className="relative inline-block mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-lg sm:text-2xl">
                                {selectedExercise.animation_character}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                            Votre coach IA personnalisé vous guidera
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    {selectedExercise.instructions &&
                      selectedExercise.instructions.length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Target className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                            Instructions personnalisées
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {selectedExercise.instructions.map(
                              (instruction, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 sm:gap-4 p-2 sm:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700"
                                >
                                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-white">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                                    {instruction}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Tips Section */}
                    {/* <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        </div>
                        Conseils de votre coach IA
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg border border-rose-200 dark:border-rose-700">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
                            Respirez profondément et restez détendu(e)
                          </p>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Focus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
                            Concentrez-vous sur le moment présent
                          </p>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
                            Chaque petit progrès compte dans votre parcours
                          </p>
                        </div>
                      </div>
                    </div> */}
                    {selectedExercise?.coach_tips &&
                      selectedExercise.coach_tips.length === 3 && (
                        <div className="space-y-3 sm:space-y-4 mt-6">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                            Conseils de votre coach IA
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg border border-rose-200 dark:border-rose-700">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
                                {selectedExercise.coach_tips[0]}
                              </p>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Focus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
                                {selectedExercise.coach_tips[1]}
                              </p>
                            </div>
                            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-1">
                                {selectedExercise.coach_tips[2]}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Videos */}
                    {selectedExercise.recommended_videos &&
                      selectedExercise.recommended_videos.length > 0 && (
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                            Ressources recommandées
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {selectedExercise.recommended_videos.map(
                              (url, index) => {
                                const videoId = new URL(url).searchParams.get(
                                  "v"
                                );
                                return (
                                  <div
                                    key={index}
                                    className="relative aspect-video rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
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
                                      className="transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
                      <button
                        onClick={() => handleStartExercise(selectedExercise)}
                        disabled={selectedExercise.completed}
                        className={`group relative flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                          selectedExercise.completed
                            ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
                        }`}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {selectedExercise.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">
                              Exercice terminé
                            </span>
                            <span className="sm:hidden">Terminé</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">
                              Commencer l'exercice
                            </span>
                            <span className="sm:hidden">Commencer</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowScheduler(true)}
                        className="group relative flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-2 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 text-sm sm:text-base"
                      >
                        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Planifier
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center px-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                        <Target className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Sélectionnez votre exercice
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
                        Choisissez un exercice dans la liste pour découvrir
                        votre séance personnalisée par IA
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl border border-white/20 dark:border-gray-700/50">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Planifier votre exercice
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Programmez votre session avec votre coach IA
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-zinc-800 rounded-xl p-3 sm:p-4">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Heure de la session
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border-2 border-indigo-200 dark:border-indigo-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors text-sm sm:text-base"
                />
              </div>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowScheduler(false)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  onClick={handleScheduleExercise}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-colors shadow-lg text-sm sm:text-base"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
