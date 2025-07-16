"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Target,
  Clock,
  Zap,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

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

  useEffect(() => {
    document.title = "Tsinjool - Mes Progrès";
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Mode démo - utiliser des données de test
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
        generateWeeklyData();
        generateAchievements(mockStats);
        setLoading(false);
        return;
      }

      // Essayer de charger depuis l'API
      try {
        const response = await axios.get(
          "https://tsinjool-backend.onrender.com/api/progress/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setStats(response.data);
        generateWeeklyData();
        generateAchievements(response.data);
      } catch (apiError) {
        console.log("API non disponible, utilisation des données de test");
        // Utiliser les données de test si l'API n'est pas disponible
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
        generateWeeklyData();
        generateAchievements(mockStats);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors du chargement des progrès.");
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyData = () => {
    // Simuler des données hebdomadaires (à remplacer par de vraies données de l'API)
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const data = days.map((day) => ({
      day,
      exercises: Math.floor(Math.random() * 5),
      time: Math.floor(Math.random() * 60) + 10,
    }));
    setWeeklyData(data);
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

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-300";
  };
  console.log(getProgressColor);

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Commencez votre série aujourd'hui !";
    if (streak === 1) return "Bon début ! Continuez demain !";
    if (streak < 7) return `${streak} jours de suite ! Excellent !`;
    if (streak < 30) return `${streak} jours ! Vous êtes sur une lancée !`;
    return `${streak} jours ! Incroyable régularité !`;
  };

  const calculateNextLevelProgress = () => {
    if (!stats) return 0;
    const pointsForCurrentLevel = (stats.current_level - 1) * 100;
    const pointsForNextLevel = stats.current_level * 100;
    const currentLevelPoints = stats.total_points - pointsForCurrentLevel;
    return (currentLevelPoints / 100) * 100;
    console.log(pointsForNextLevel);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Chargement de vos progrès...</p>
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mes Progrès</h1>
                <p className="text-sm text-gray-600">
                  Suivez votre évolution et vos accomplissements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Niveau {stats.current_level}
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {stats.total_points} pts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Exercices terminés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_exercises_completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(stats.total_time_spent / 60)}h{" "}
                  {stats.total_time_spent % 60}min
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Série actuelle</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.current_streak} jours
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Progression globale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(stats.overall_progress)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progression du niveau */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Progression du niveau
            </h3>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Niveau {stats.current_level}
              </span>
              <span className="text-sm font-medium text-gray-600">
                Niveau {stats.current_level + 1}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${calculateNextLevelProgress()}%` }}
              />
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {stats.total_points} points
              </p>
              <p className="text-sm text-gray-600">
                {100 - (stats.total_points % 100)} points pour le niveau suivant
              </p>
            </div>
          </div>

          {/* Série quotidienne */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Série quotidienne
            </h3>

            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-3xl font-bold text-orange-600 mb-1">
                {stats.current_streak}
              </p>
              <p className="text-sm text-gray-600">jours consécutifs</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-center text-orange-800 font-medium">
                {getStreakMessage(stats.current_streak)}
              </p>
            </div>
          </div>
        </div>

        {/* Activité hebdomadaire */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Activité de la semaine
          </h3>

          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">
                  {day.day}
                </div>
                <div
                  className="w-full bg-gray-200 rounded-lg flex flex-col justify-end"
                  style={{ height: "100px" }}
                >
                  <div
                    className="bg-gradient-to-t from-purple-500 to-blue-600 rounded-lg transition-all duration-500"
                    style={{
                      height: `${Math.max((day.exercises / 5) * 100, 10)}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {day.exercises} ex.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accomplissements */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Accomplissements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4
                    className={`font-semibold mb-1 ${
                      achievement.unlocked ? "text-green-800" : "text-gray-600"
                    }`}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      achievement.unlocked ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}
