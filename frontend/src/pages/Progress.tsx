"use client";

import { useState, useEffect } from "react";
import { CheckCircle, BarChart3, Zap, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ProgressStats {
  total_exercises_completed: number;
  total_time_spent: number;
  current_streak: number;
  last_activity_date: string | null;
  total_steps: number;
  completed_steps: number;
  overall_progress: number;
  current_level: number;
  total_points: number;
}

interface WeeklyProgress {
  day: string;
  exercises: number;
  time: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date_unlocked?: string;
}

export default function Progress() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(achievements);

  useEffect(() => {
    document.title = "Tsinjool - Mes Progrès";
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Mode démo - données fictives
        const mockStats: ProgressStats = {
          total_exercises_completed: 3,
          total_time_spent: 85,
          current_streak: 5,
          last_activity_date: new Date().toISOString().split("T")[0],
          total_steps: 4,
          completed_steps: 1,
          overall_progress: 25,
          current_level: 2,
          total_points: 150,
        };
        setStats(mockStats);
        setWeeklyData([
          { day: "Lun", exercises: 1, time: 30 },
          { day: "Mar", exercises: 0, time: 0 },
          { day: "Mer", exercises: 2, time: 50 },
          { day: "Jeu", exercises: 1, time: 15 },
          { day: "Ven", exercises: 0, time: 0 },
          { day: "Sam", exercises: 1, time: 20 },
          { day: "Dim", exercises: 0, time: 0 },
        ]);
        generateAchievements(mockStats);
        setLoading(false);
        return;
      }

      const [progressRes, weeklyRes] = await Promise.all([
        axios.get("https://backend-tsinjool.onrender.com/api/progress/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(
          "https://backend-tsinjool.onrender.com/api/weekly-activity/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        ),
      ]);

      setStats(progressRes.data);
      setWeeklyData(weeklyRes.data);
      generateAchievements(progressRes.data);
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors du chargement des progrès.");
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = (stats: ProgressStats) => {
    const allAchievements: Achievement[] = [
      {
        id: "first_exercise",
        title: "Premier Pas",
        description: "Terminez votre premier exercice",
        icon: "🎯",
        unlocked: stats.total_exercises_completed >= 1,
      },
      {
        id: "five_exercises",
        title: "En Route !",
        description: "Terminez 5 exercices",
        icon: "🚀",
        unlocked: stats.total_exercises_completed >= 5,
      },
      {
        id: "first_step",
        title: "Étape Franchie",
        description: "Terminez votre première étape complète",
        icon: "🏆",
        unlocked: stats.completed_steps >= 1,
      },
      {
        id: "week_streak",
        title: "Régularité",
        description: "Maintenez une série de 7 jours",
        icon: "🔥",
        unlocked: stats.current_streak >= 7,
      },
      {
        id: "level_up",
        title: "Montée en Grade",
        description: "Atteignez le niveau 2",
        icon: "⭐",
        unlocked: stats.current_level >= 2,
      },
      {
        id: "time_master",
        title: "Maître du Temps",
        description: "Passez 5 heures en exercices",
        icon: "⏰",
        unlocked: stats.total_time_spent >= 300,
      },
      {
        id: "half_journey",
        title: "Mi-Parcours",
        description: "Terminez 50% de votre parcours",
        icon: "🎖️",
        unlocked: stats.overall_progress >= 50,
      },
      {
        id: "completionist",
        title: "Perfectionniste",
        description: "Terminez tout votre parcours",
        icon: "👑",
        unlocked: stats.overall_progress >= 100,
      },
    ];
    setAchievements(allAchievements);
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Commencez votre série aujourd'hui !";
    if (streak === 1) return "Bon début ! Continuez demain !";
    if (streak < 7) return `${streak} jours de suite ! Excellent !`;
    if (streak < 30) return `${streak} jours ! Vous êtes sur une lancée !`;
    return `${streak} jours ! Incroyable régularité !`;
  };
  console.log(getStreakMessage);

  const calculateNextLevelProgress = () => {
    if (!stats) return 0;
    const pointsForCurrentLevel = (stats.current_level - 1) * 100;
    const currentLevelPoints = stats.total_points - pointsForCurrentLevel;
    return (currentLevelPoints / 100) * 100;
  };
  console.log(calculateNextLevelProgress);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Chargement de vos progrès...
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Aucune donnée de progression disponible.
          </p>
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

  // Le composant principal (statistiques + niveau + série + activité + accomplissements)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-950 dark:to-zinc-900 py-10">
      {/* Statistiques */}
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Exercices terminés
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.total_exercises_completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Temps total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.floor(stats.total_time_spent / 60)}h{" "}
                  {stats.total_time_spent % 60}min
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Série actuelle
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.current_streak} jours
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Progression globale
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(stats.overall_progress)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activité hebdomadaire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full px-4">
        {/* Activité hebdomadaire */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Activité de la semaine
          </h3>
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {day.day}
                </div>
                <div
                  className="w-full bg-gray-200 dark:bg-zinc-700 rounded-lg flex flex-col justify-end"
                  style={{ height: "100px" }}
                >
                  <div
                    className="bg-gradient-to-t from-purple-500 to-blue-600 rounded-lg transition-all duration-500"
                    style={{
                      height: `${Math.max((day.exercises / 5) * 100, 10)}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {day.exercises} ex.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progression PieChart */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Progression Globale
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={[
                  { name: "Progression", value: stats.overall_progress },
                  { name: "Reste", value: 100 - stats.overall_progress },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => {
                  const percent = entry.percent ?? 0;
                  return `${entry.name}: ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#6366F1" /> {/* violet pour progression */}
                <Cell fill="#E5E7EB" /> {/* gris clair pour le reste */}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accomplissements */}
      <div className="w-full px-4 mb-12">
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Accomplissements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-700/50 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4
                    className={`font-semibold mb-1 ${
                      achievement.unlocked
                        ? "text-green-800 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      achievement.unlocked
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
