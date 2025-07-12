import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type Profile = {
  coaching_type: "life" | "career" | "health";
  bio: string;
  photo: string | null;
};

type AuthContextType = {
  token: string | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const localToken = localStorage.getItem("token");
    if (!localToken) {
      setLoading(false);
      return;
    }

    try {
      setToken(localToken); // <-- MAJ ici
      const res = await axios.get("https://tsinjool-backend.onrender.com/api/profile/", {
        headers: { Authorization: `Token ${localToken}` },
      });
      setProfile(res.data);
    } catch (e) {
      console.error("Erreur chargement profil :", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // pas besoin de token ici, on le lit directement depuis localStorage

  return (
    <AuthContext.Provider
      value={{
        token,
        profile,
        loading,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
