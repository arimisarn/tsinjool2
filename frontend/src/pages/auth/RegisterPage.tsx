import React, { useState } from "react";
import { addToast, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password1 !== password2) {
      addToast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("https://tsinjool-backend.onrender.com/api/accounts/register/", {
        email,
        password: password1, // le backend utilise `password`, pas `password1`
      });

      if (response.status === 201 || response.status === 200) {
        addToast({
          title: "Succès",
          description: "Inscription réussie 🎉",
          variant: "success",
        });
        navigate("/login");
      }
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description:
          error?.response?.data?.email?.[0] ||
          error?.response?.data?.password?.[0] ||
          error?.response?.data?.detail ||
          "Échec de l’inscription",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = "https://tsinjool-backend.onrender.com/accounts/google/login/";
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Créer un compte
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <Button
          type="submit"
          className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-xl"
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </Button>

        <div className="text-center text-sm text-gray-500">ou</div>

        <Button
          type="button"
          onClick={handleGoogle}
          className="w-full border border-gray-300 text-gray-800 hover:bg-gray-100 transition rounded-xl"
        >
          Continuer avec Google
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
