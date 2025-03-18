import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  position: string;
  phone: string;
  avatar_url: string;
}

type AuthStore = {
  user: User | null;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      logout: () => set({ user: null, profile: null }),
    }),
    { name: "auth-store" }
  )
);
