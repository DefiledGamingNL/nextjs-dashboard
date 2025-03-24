"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "./authStore";
import { toast } from "sonner";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

const supabase = createClient();

export type UserProfile = {
  id: string;
  full_name: string;
  username: string;
  position: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  role: string;
  phone: string;
  online_status: boolean;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const setProfiles = useAuthStore((state) => state.setProfiles);
  const setIsOnline = useAuthStore((state) => state.setIsOnline);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        toast.error("Failed to fetch profiles");
        return;
      }

      setProfiles(profiles);
    };

    fetchProfiles();
  }, [setProfiles]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) return;

      setUser(user);

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) return;
        setProfile(profile as UserProfile);

        // Set the initial online status when the user is fetched
        setIsOnline(true); // Assuming the user is online when fetched
      }
    };

    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setIsOnline(false); // Set online status to false when user signs out
        } else if (session?.user) {
          setUser(session.user);
          fetchUser();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setProfile]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          console.log("Profile updated!", payload);

          // Ensure payload.new has expected profile properties
          if (payload.new && "id" in payload.new) {
            setProfile(payload.new as UserProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, setProfile]);

  return <>{children}</>;
}
