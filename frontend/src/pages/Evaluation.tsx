import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EvaluationPage from "./Evaluationpage";

export default function Evaluation() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !profile?.coaching_type) {
      navigate("/profile-setup");
    }
  }, [loading, profile]);

  if (loading || !profile?.coaching_type) return null;

  return <EvaluationPage coachingType={profile.coaching_type} />;
}
  