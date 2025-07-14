import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log(supabaseUrl);
console.log("SUPABASE_ANON_KEY =", import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseUrl or supabaseAnonKey is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
