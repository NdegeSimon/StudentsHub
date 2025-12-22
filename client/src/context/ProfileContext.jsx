import { createContext, useContext, useEffect, useState } from "react";
import { userAPI } from "../utils/api";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    const res = await userAPI.updateProfile(data);
    setProfile(res.data);
    return res.data;
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        refreshProfile: fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
};
