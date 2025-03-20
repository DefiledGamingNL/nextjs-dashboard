import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function isLoggedIn() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return data;
}
