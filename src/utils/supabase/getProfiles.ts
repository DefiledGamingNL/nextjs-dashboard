import { createClient } from "./server";

export async function getProfiles() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
