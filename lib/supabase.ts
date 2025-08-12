// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// This client is for client-side (browser) use and for server-side operations
// where you want RLS to apply.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This client is for server-side admin operations ONLY and bypasses RLS.
// Use this with extreme caution.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // This is important to prevent the service key from being stored in local storage
    // or cookies on the server, which could be a security risk.
    persistSession: false,
  },
});