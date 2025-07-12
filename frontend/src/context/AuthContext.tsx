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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(setToken);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        "https://tsinjool-backend.onrender.com/api/profile/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setProfile(res.data);
    } catch (e) {
      console.error("Erreur lors du chargement du profil :", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]); //

  return (
    <AuthContext.Provider
      value={{ token, profile, loading, refreshProfile: fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
