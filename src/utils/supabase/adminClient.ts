import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!, // Gebruik de correcte env variabele
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
