import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with fallback to prevent runtime errors
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key",
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL !==
      "https://placeholder-url.supabase.co" &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== "placeholder-key" &&
    import.meta.env.VITE_SUPABASE_URL !== "" &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== ""
  );
};
