import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ⛔ Supprimer le token
    toast.success("Déconnexion réussie");
    navigate("/"); // 🔁 Redirection (ex: accueil ou login)
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white"
    >
      Se déconnecter
    </Button>
  );
}
