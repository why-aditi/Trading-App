import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ponytail: lazy singleton — avoids build-time crash when env vars aren't set
let client: SupabaseClient | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return client;
}
