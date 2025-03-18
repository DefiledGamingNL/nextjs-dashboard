import { createClient } from "@/utils/supabase/server";

export async function fetchUserAndProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, role")
    .eq("id", user.id)
    .single();

  return { user, profile };
}
