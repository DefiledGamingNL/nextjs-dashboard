import { createClient } from "./server";

export async function GET_USER_PROFILE() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("full_name, role, id")
    .eq("id", data?.user?.id)
    .single();

  return { user };
}
