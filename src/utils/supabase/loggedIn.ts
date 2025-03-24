import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function isLoggedIn() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const isCurrentUser = data?.user?.id;
  const isRole = data?.user?.role;

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("full_name, role, id, position, phone, username, online_status")
    .eq("id", data?.user?.id)
    .single();

  if (userError) {
    return null;
  }

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .order("online_status", { ascending: false })
    .order("role", {
      ascending: true,
    });

  if (profileError) {
    return null;
  }

  return { data, user, profiles, isCurrentUser, isRole };
}
