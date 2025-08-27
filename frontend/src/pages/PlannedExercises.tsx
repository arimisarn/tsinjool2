import { useEffect, useState } from "react";
import axios from "axios";

interface PlannedExercise {
  id: number;
  exercise_title: string;
  planned_datetime: string;
  notified: boolean;
}

export default function PlannedExercises() {
  const [exercises, setExercises] = useState<PlannedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlannedExercises = async () => {
      try {
        const res = await axios.get(
          "https://backend-tsinjool.onrender.com/api/exercises/planned/",
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setExercises(res.data);
      } catch (err) {
        console.error("Erreur chargement exercices planifiés", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlannedExercises();
  }, [token]);

  if (loading) return <p>Chargement des exercices planifiés...</p>;

  if (exercises.length === 0) return <p>Aucun exercice planifié.</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Exercices planifiés</h2>
      <ul>
        {exercises.map((ex) => (
          <li
            key={ex.id}
            className="p-3 mb-2 bg-gray-100 rounded shadow flex justify-between"
          >
            <span>{ex.exercise_title}</span>
            <time className="text-gray-500 text-sm">
              {new Date(ex.planned_datetime).toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
}
