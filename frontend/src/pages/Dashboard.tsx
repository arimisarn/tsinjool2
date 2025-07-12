import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, CheckCircle, CalendarDays, Lightbulb } from "lucide-react";

interface Goal {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  timeline: string;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  frequency: string;
}

interface TimelineItem {
  week: number;
  focus: string;
  actions: string[];
}

interface CoachingPathData {
  coaching_type: string;
  analysis: string;
  goals: Goal[];
  recommendations: Recommendation[];
  timeline: TimelineItem[];
}

export default function Dashboard() {
  const [data, setData] = useState<CoachingPathData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoachingPath = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/coaching-path/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (error) {
        console.error("Erreur récupération dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingPath();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Impossible de charger les données du coaching.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <header className="mb-8 flex items-center space-x-3">
          <Lightbulb className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-indigo-900">
            Votre Parcours de Coaching ({data.coaching_type.toUpperCase()})
          </h1>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyse</h2>
          <p className="text-gray-700 text-lg italic border-l-4 border-indigo-500 pl-4">
            {data.analysis}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-600 w-6 h-6" />
            Objectifs
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.goals.map((goal, i) => (
              <div
                key={i}
                className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-indigo-700 text-lg">{goal.title}</h3>
                <p className="mt-1 text-gray-600">{goal.description}</p>
                <p className="mt-2 text-sm font-medium">
                  Priorité:{" "}
                  <span
                    className={`font-bold ${
                      goal.priority === "high"
                        ? "text-red-600"
                        : goal.priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-600"
                    }`}
                  >
                    {goal.priority.toUpperCase()}
                  </span>
                </p>
                <p className="text-sm text-gray-500">Timeline: {goal.timeline}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Lightbulb className="text-yellow-600 w-6 h-6" />
            Recommandations
          </h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="border-l-4 border-yellow-400 pl-3">
                <p className="font-semibold">{rec.title} ({rec.frequency})</p>
                <p>{rec.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays className="text-blue-600 w-6 h-6" />
            Timeline
          </h2>
          <div className="space-y-6">
            {data.timeline.map((item) => (
              <div
                key={item.week}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm"
              >
                <h3 className="font-bold text-indigo-700 mb-2">Semaine {item.week}</h3>
                <p className="italic mb-2">{item.focus}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {item.actions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
