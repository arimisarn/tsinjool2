"use client";

import { useState, useEffect } from "react";
import { CheckCircle, BarChart3, Zap, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Interfaces
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
      if (!token) return;

      const [progressRes, weeklyRes] = await Promise.all([
        axios.get("https://tsinjool-backend.onrender.com/api/progress/", {
          headers: { Authorization: `Token ${token}` },
        }),
        axios.get(
          "https://tsinjool-backend.onrender.com/api/weekly-activity/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        ),
      ]);

      setStats(progressRes.data);
      setWeeklyData(weeklyRes.data);
      generateAchievements(progressRes.data);
    } catch (error) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4 md:px-8">
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-10">
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          label="Exercices terminés"
          value={stats.total_exercises_completed}
          bg="green"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          label="Temps total"
          value={`${Math.floor(stats.total_time_spent / 60)}h ${
            stats.total_time_spent % 60
          }min`}
          bg="blue"
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-orange-600" />}
          label="Série actuelle"
          value={`${stats.current_streak} jours`}
          bg="orange"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-purple-600" />}
          label="Progression globale"
          value={`${Math.round(stats.overall_progress)}%`}
          bg="purple"
        />
      </div>

      {/* Activité hebdomadaire */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-10 max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Activité de la semaine
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="exercises"
              stroke="#6366f1"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="time"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accomplissements */}
      <div className="bg-white rounded-xl p-6 shadow-md max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Accomplissements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`p-5 rounded-xl border-2 text-center transition-all duration-200 ${
                a.unlocked
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="text-4xl mb-2">{a.icon}</div>
              <h4
                className={`font-semibold mb-1 ${
                  a.unlocked ? "text-green-800" : "text-gray-600"
                }`}
              >
                {a.title}
              </h4>
              <p
                className={`text-sm ${
                  a.unlocked ? "text-green-600" : "text-gray-500"
                }`}
              >
                {a.description}
              </p>
              {a.unlocked && (
                <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
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

// StatCard Component
function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: "green" | "blue" | "orange" | "purple";
}) {
  const bgColors: Record<string, string> = {
    green: "bg-green-100",
    blue: "bg-blue-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100",
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-4">
      <div
        className={`w-12 h-12 ${bgColors[bg]} rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
