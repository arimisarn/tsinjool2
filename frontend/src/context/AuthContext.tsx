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
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  profile: null,
  loading: true,
  refreshProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const [token] = useState(localStorage.getItem("token"));
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  console.log(setToken);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://tsinjool-backend.onrender.com/api/profile/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      console.log("Profil API:", res.data);
      setProfile(res.data);
    } catch (e) {
      console.error("Erreur profil:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, profile, loading, refreshProfile: fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
