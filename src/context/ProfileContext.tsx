"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  email: string;
  id?: string;
}

interface ProfileContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        console.error("User not found");
        setLoading(false);
        return;
      }

      setUser(authData.user);

      // Fetch user profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        console.error("Profile Fetch Error:", profileError.message);
        setLoading(false);
        return;
      }

      setProfile({
        username: profileData.username,
        avatar_url: profileData.avatar_url,
        email: authData.user.email ?? "",
        id: authData.user.id,
      });

      setLoading(false);
    }

    fetchProfile();
  }, []);

  const refreshProfile = async () => {
    setLoading(true);
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user?.id)
      .single();

    if (error) {
      console.error("Profile Refresh Error:", error.message);
      setLoading(false);
      return;
    }

    setProfile({
      username: profileData.username,
      avatar_url: profileData.avatar_url,
      email: user?.email ?? "",
      id: user?.id ?? "",
    });

    setLoading(false);
  };

  return (
    <ProfileContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use ProfileContext
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
