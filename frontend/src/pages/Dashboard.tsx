"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Target,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

import { motion, AnimatePresence } from "framer-motion";

interface Step {
  id: number;
  title: string;
  description: string;
  exercises: Exercise[];
  completed: boolean;
  progress: number;
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  duration: number;
  type: string;
  completed: boolean;
}

interface UserProfile {
  name: string;
  photo?: string;
  bio?: string;
  coaching_type: string;
  level: number;
  points: number;
}

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [steps, setSteps] = useState<Step[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPath, setGeneratingPath] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  useEffect(() => {
    document.title = "Tsinjool - Tableau de bord";
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Veuillez vous connecter.");
        navigate("/login");
        return;
      }

      const profileResponse = await axios.get(
        "https://tsinjool-backend.onrender.com/api/profile/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setUserProfile(profileResponse.data);

      try {
        const pathResponse = await axios.get(
          "https://tsinjool-backend.onrender.com/api/coaching-paths/my/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setSteps(pathResponse.data.steps || []);
      } catch (pathError: any) {
        if (pathError.response?.status === 404) {
          await generateCoachingPath();
        } else {
          throw pathError;
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  const generateCoachingPath = async () => {
    setGeneratingPath(true);
    try {
      const token = localStorage.getItem("token");
      const evaluationId = location.state?.evaluationId;
      if (!evaluationId) {
        toast.error("Évaluation non trouvée. Veuillez recommencer.");
        navigate("/evaluation");
        return;
      }
      const response = await axios.post(
        "https://tsinjool-backend.onrender.com/api/generate-path/",
        { evaluation_id: evaluationId },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setSteps(response.data.coaching_path.steps);
      toast.success("Votre parcours personnalisé a été généré !");
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors de la génération du parcours.");
    } finally {
      setGeneratingPath(false);
    }
  };

  const getCoachingTypeLabel = (type: string) => {
    const labels = {
      life: "Coaching de vie",
      career: "Coaching de carrière",
      health: "Coaching santé",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStepIcon = (index: number) => {
    const icons = [Target, Trophy, Star, CheckCircle];
    const IconComponent = icons[index] || Target;
    return <IconComponent className="w-6 h-6" />;
  };

  const handleStepClick = (step: Step) => {
    navigate(`/step/${step.id}`, { state: { step } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <Skeleton className="w-16 h-16 rounded-full mb-4" />
        <Skeleton className="w-48 h-6 mb-2" />
        <Skeleton className="w-64 h-4" />
      </div>
    );
  }

  if (generatingPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <Skeleton className="w-20 h-20 rounded-full mb-6 animate-spin" />
        <Skeleton className="w-64 h-8 mb-2" />
        <Skeleton className="w-96 h-5" />
      </div>
    );
  }

  return (
    <motion.div
      key={isDark ? "dark" : "light"}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800 transition-colors duration-500"
    >
      {/* Dark Mode Toggle */}
      <div className="flex justify-end p-4">
        <button
          aria-label="Toggle Dark Mode"
          onClick={() => setIsDark(!isDark)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.span
                key="sun"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <Sun className="w-6 h-6" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <Moon className="w-6 h-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-300">
            Voici votre parcours personnalisé de{" "}
            {getCoachingTypeLabel(userProfile?.coaching_type || "")}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Étapes complétées
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {steps.filter((s) => s.completed).length}/{steps.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Exercices réalisés
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {steps.reduce(
                    (acc, step) =>
                      acc + step.exercises.filter((e) => e.completed).length,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Temps total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {steps.reduce(
                    (acc, step) =>
                      acc +
                      step.exercises.reduce(
                        (exerciseAcc, exercise) =>
                          exerciseAcc + exercise.duration,
                        0
                      ),
                    0
                  )}{" "}
                  min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coaching Steps */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Votre parcours de coaching
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                onClick={() => handleStepClick(step)}
                className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        step.completed
                          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                          : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        getStepIcon(index)
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.exercises.length} exercices
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {step.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>Progression</span>
                    <span>{Math.round(step.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        step.completed ? "bg-green-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                </div>

                {/* Exercise Preview */}
                <div className="flex gap-2">
                  {step.exercises
                    .slice(0, 3)
                    .map((exercise, _exerciseIndex) => (
                      <div
                        key={exercise.id}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                          exercise.completed
                            ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {exercise.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Actions rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const nextStep = steps.find((s) => !s.completed);
                if (nextStep) {
                  navigate(`/step/${nextStep.id}`, {
                    state: { step: nextStep },
                  });
                } else {
                  toast.success(
                    "Félicitations ! Vous avez terminé tout votre parcours !"
                  );
                }
              }}
              disabled={steps.length === 0}
              className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-purple-900 dark:text-purple-300">
                {steps.filter((s) => s.completed).length === steps.length
                  ? "Parcours terminé !"
                  : "Continuer le parcours"}
              </span>
            </button>

            <button
              onClick={() => navigate("/progress")}
              className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-300">
                Voir mes progrès
              </span>
            </button>

            <button
              onClick={() => navigate("/profile-setup")}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-300">
                Modifier le profil
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
