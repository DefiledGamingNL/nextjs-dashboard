import { createClient } from "./server";

export async function isAuthenticated() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return false;
  }

  return true;
}
