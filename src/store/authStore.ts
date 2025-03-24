import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  position: string;
  phone: string;
  avatar_url: string;
  role: string;
  online_status: boolean;
}

type AuthStore = {
  user: User | null;
  profile: UserProfile | null;
  profiles: UserProfile[] | null;
  isAdmin: boolean;
  isOnline: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setProfiles: (profiles: UserProfile[] | null) => void;
  setIsOnline: (isOnline: boolean) => void;
  checkAdmin: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAdmin: false,
      isOnline: false,
      profiles: [],

      setIsOnline: async (isOnline: boolean) => {
        set({ isOnline });

        // Check if user is logged in before updating the online status
        const user = get().user;
        if (!user) return;

        const supabase = await createClient();

        // Update the online_status in the database
        const { error } = await supabase
          .from("profiles")
          .update({ online_status: isOnline })
          .eq("id", user.id);

        if (error) {
          toast.error("Failed to update online status");
        }
      },

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
