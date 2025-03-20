import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  position: string;
  phone: string;
  avatar_url: string;
  role: string;
}

type AuthStore = {
  user: User | null;
  profile: UserProfile | null;
  profiles: UserProfile[] | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setProfiles: (profiles: UserProfile[] | null) => void;
  checkAdmin: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAdmin: false,
      profiles: [],

      setUser: (user) => set({ user }),
      setProfile: (profile) => {
        set({ profile, isAdmin: profile?.role === "admin" });
      },
      setProfiles: (profiles) => set({ profiles }),
      checkAdmin: async () => {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          set({ isAdmin: false });
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError || !profileData) {
          set({ isAdmin: false });
          return;
        }

        set({ isAdmin: profileData.role === "admin" });
      },

      logout: () => set({ user: null, profile: null, isAdmin: false }),
    }),
    { name: "auth-store" }
  )
);
