"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CheckCircle, BarChart3, Zap, Target, Clock } from "lucide-react";
import { useState, useEffect } from "react";
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
    ];
    setAchievements(allAchievements);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center animate-pulse mb-4 mx-auto">
            <BarChart3 className="text-white w-8 h-8" />
          </div>
          <p className="text-gray-600">Chargement des progrès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
        <StatCard
          title="Exercices terminés"
          value={stats.total_exercises_completed}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          color="green"
        />
        <StatCard
          title="Temps total"
          value={`${Math.floor(stats.total_time_spent / 60)}h ${
            stats.total_time_spent % 60
          }min`}
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        <StatCard
          title="Série actuelle"
          value={`${stats.current_streak} jours`}
          icon={<Zap className="w-6 h-6 text-orange-600" />}
          color="orange"
        />
        <StatCard
          title="Progression globale"
          value={`${Math.round(stats.overall_progress)}%`}
          icon={<Target className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Weekly Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Activité hebdomadaire
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="exercises" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm max-w-7xl mx-auto mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Accomplissements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-lg border-2 ${
                ach.unlocked
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="text-3xl mb-2 text-center">{ach.icon}</div>
              <h4
                className={`text-center font-semibold mb-1 ${
                  ach.unlocked ? "text-green-800" : "text-gray-600"
                }`}
              >
                {ach.title}
              </h4>
              <p
                className={`text-sm text-center ${
                  ach.unlocked ? "text-green-600" : "text-gray-500"
                }`}
              >
                {ach.description}
              </p>
              {ach.unlocked && (
                <div className="mt-2 flex justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Retour au tableau de bord
        </button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
