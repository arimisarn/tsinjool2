import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    nom_utilisateur: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://tsinjool-backend.onrender.com/api/register/", formData);
      localStorage.setItem("token", res.data.token);
      toast.success("Inscription réussie !");
      navigate("/profile-setup");
    } catch (error: any) {
      const msg =
        error?.response?.data?.email?.[0] ||
        error?.response?.data?.nom_utilisateur?.[0] ||
        error?.response?.data?.non_field_errors?.[0] ||
        "Erreur lors de l'inscription.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-sm text-gray-400">START FOR FREE</h2>
          <h1 className="text-4xl font-bold text-gray-900">
            Create new account<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-sm text-gray-500">
            Already A Member?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Log In
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                name="nom_utilisateur"
                placeholder="Username"
                value={formData.nom_utilisateur}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={handleChange}
              required
            />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                disabled
                className="bg-gray-200 text-gray-500 cursor-not-allowed"
              >
                Change method
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? "Loading..." : "Create account"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/register-bg.jpg"
            alt="Mountains"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-white rounded-l-[100px] mix-blend-screen" />
      </div>
    </div>
  );
}
