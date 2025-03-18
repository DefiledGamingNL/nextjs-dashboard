"use client";
import { useEffect } from "react";

import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "./authStore";

const supabase = createClient();

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) return console.error(error);

      setUser(user);

      // Profiel ophalen uit database
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) return console.error(profileError);
        setProfile(profile);
      }
    };

    fetchUser();

    // Luisteren naar auth-veranderingen
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
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

  return <>{children}</>;
}
