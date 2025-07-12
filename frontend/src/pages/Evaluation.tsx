import { useAuth } from "../context/AuthContext";
import EvaluationPage from "./Evaluationpage";


export default function Evaluation() {
  const { profile, loading } = useAuth();

  console.log("Profil dans Evaluation:", profile);

  if (loading) return <p>Chargement...</p>;
  if (!profile?.coaching_type) return <p>Type de coaching non défini</p>;
  console.log("PROFILE:", profile);


  return <EvaluationPage coachingType={profile.coaching_type} />;
}
